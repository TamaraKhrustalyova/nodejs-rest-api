const express = require('express');

const contactsRouter = express.Router();
const contactsController = require('../../controllers/contacts-controller');
const { isEmptyBody } = require('../../middlewares/index');

contactsRouter.get('/', contactsController.getAll)

contactsRouter.get('/:contactId', contactsController.getById)

contactsRouter.post('/', isEmptyBody, contactsController.add)

contactsRouter.put('/:contactId', isEmptyBody, contactsController.updateById)

contactsRouter.delete('/:contactId', contactsController.deleteById)

module.exports = contactsRouter;