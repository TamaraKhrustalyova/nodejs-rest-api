const HttpError = require('../helpers/HttpError');
const { ctrlWrapper } = require('../decorators/index');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const {JWT_SECRET} = process.env;
console.log(JWT_SECRET)

const authenticate = async(req, res, next) => {
    const {authorization = ""} = req.headers;
    console.log(authorization)
    const [bearer, token] = authorization.split(" ");
    if(bearer !== "Bearer") {
        throw HttpError(401);
    }

    try {
        const {id} = jwt.verify(token, JWT_SECRET);
        console.log(id)
        const user = await User.findById(id);
        if(!user || !user.token){
            throw HttpError(401);
        }
        req.user = user;
        next();
    } 
    catch(error) {
        next(HttpError(401));
    }
}

module.exports = ctrlWrapper(authenticate);