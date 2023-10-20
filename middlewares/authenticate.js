const HttpError = require('../helpers/HttpError');
const { ctrlWrapper } = require('../decorators/index');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');

const {JWT_SECRET} = process.env;

const authenticate = async(req, res, next) => {
    const {authorization = ""} = req.headers;
    const [bearer, token] = authorization.split(" ");
    if(bearer !== "Bearer") {
        throw HttpError(401);
    }

    try {
        const {id} = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id);
        if(!user || !user.token){
            throw HttpError(401);
        }
        req.user = user;
        next();
    } 
    catch(error) {
        next(HttpError(401, "Not authorized"));
    }
}

module.exports = ctrlWrapper(authenticate);