const express = require('express');
const usersController = require('../../controllers/users-controller');
const { isEmptyBody } = require('../../middlewares/index');
const {validateBody} = require('../../decorators/index');
const {userRegisterSchema, userLoginSchema} = require('../../models/User');

const userRegisterValidate = validateBody(userRegisterSchema); 
const userLoginValidate = validateBody(userLoginSchema);

const usersRouter = express.Router();

usersRouter.post('/register', isEmptyBody, userRegisterValidate, usersController.register);

usersRouter.post('/login', isEmptyBody, userLoginValidate, usersController.login);

module.exports = usersRouter;