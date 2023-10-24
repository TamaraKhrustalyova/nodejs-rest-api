const express = require('express');
const usersController = require('../../controllers/users-controller');
const { authenticate, isEmptyBody, upload } = require('../../middlewares/index');
const { validateBody } = require('../../decorators/index');
const { userRegisterSchema, userLoginSchema, userUpdateSubscription } = require('../../models/User');

const userRegisterValidate = validateBody(userRegisterSchema); 
const userLoginValidate = validateBody(userLoginSchema);
const subscriptionOptionValidate = validateBody(userUpdateSubscription);

const usersRouter = express.Router();

usersRouter.post('/register', upload.single('avatar'), isEmptyBody, userRegisterValidate, usersController.register);

usersRouter.post('/login', isEmptyBody, userLoginValidate, usersController.login);

usersRouter.get('/current', authenticate, usersController.getCurrent);

usersRouter.post('/logout', authenticate, usersController.logout);

usersRouter.patch('/subscription', authenticate, isEmptyBody, subscriptionOptionValidate, usersController.updateSubscription);

usersRouter.patch('/avatars', upload.single('avatar'), authenticate, usersController.updateAvatar)

module.exports = usersRouter;