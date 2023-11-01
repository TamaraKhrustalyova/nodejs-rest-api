const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {User} = require('../models/User');
const { HttpError, sendEmail } = require('../helpers/index');
const { ctrlWrapper } = require('../decorators/index');
const gravatar = require('gravatar');
const fs = require('fs/promises');
const path = require('path');
const Jimp = require("jimp");
const { nanoid } = require('nanoid');

const avatarsPath = path.resolve('public', 'avatars');

const {JWT_SECRET, BASE_URL} = process.env;

const register = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, `${email} in use`)
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();

    const newUser = await User.create({...req.body, avatarURL, password: hashPassword, verificationToken});
    // console.log(newUser)

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`
    }

    await sendEmail(verifyEmail);

    res.status(201).json({
        subscription: newUser.subscription, 
        email: newUser.email,
    })
}

const verify = async (req, res) => { 
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    console.log(verificationToken)
    if (!user) { 
        throw HttpError(404, 'User not found')
    }
    await User.findByIdAndUpdate(user.id, { verify: true, verificationToken: " " });
    res.json({
        message: 'Verification successful'
    })
} 

const resendVarifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(404, 'Email not found')
    }
    if (user.verify) {
        throw HttpError(400, 'Verification has already been passed')
    }
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify email</a>`
    }

    await sendEmail(verifyEmail);

    res.json({
        message: "Verification email sent"
    })
}


const login = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) { 
        throw HttpError(401, "Email isn't verified")
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "24h"});
    await User.findByIdAndUpdate(user._id, {token});
    
    res.json({
        token,
        user: {
            email: user.email,
            subscription: user.subscription,
        }
    })
}

const getCurrent = async(req, res)=> {
    const {email, subscription} = req.user;

    res.json({
     email, 
     subscription,
    })
}

const logout = async(req, res)=> {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: null});
    res.status(204).json({ asd: "asd" });
}

const updateSubscription = async(req, res)=> {
    const {_id} = req.user;
    const result = await User.findByIdAndUpdate(_id, req.body);
    if(!result) {
        throw HttpError(404, "Not found")
    }
    res.json(result);
}

const updateAvatar = async(req, res)=> {
    const {_id} = req.user;
    const {path: oldPath, filename} = req.file;
    const newPath = path.join(avatarsPath, filename);

    await Jimp.read(oldPath)
        .then((img) => {
            return img.resize(250, 250);
        })
        .catch((err) => {
            console.error(err);
        });

    await fs.rename(oldPath, newPath);

    const avatar = path.join('public', 'avatars', 'filename');

    const result = await User.findByIdAndUpdate(_id, {avatarURL: avatar});
    console.log(req.file)
    res.status(201).json(result)
}

module.exports = {
    register: ctrlWrapper(register), 
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
    verify: ctrlWrapper(verify),
    resendVarifyEmail: ctrlWrapper(resendVarifyEmail),
}