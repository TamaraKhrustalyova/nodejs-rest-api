const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {User} = require('../models/User');
const { HttpError } = require('../helpers/index');
const { ctrlWrapper } = require('../decorators/index');

const {JWT_SECRET} = process.env;
console.log(JWT_SECRET)

const register = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user) {
        throw HttpError(409, `${email} in use`)
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({...req.body, password: hashPassword});

    res.status(201).json({
        subscription: newUser.subscription, 
        email: newUser.email,
    })
}

const login = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const payload = {
        id: user._id,
    }
    console.log(payload)

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "24h"});
    console.log(JWT_SECRET)
    res.json({
        token,
    })
}

module.exports = {
    register: ctrlWrapper(register), 
    login: ctrlWrapper(login),
}