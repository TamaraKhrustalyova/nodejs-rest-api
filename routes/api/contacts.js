const express = require('express');

const contactsRouter = express.Router();
const contactsController = require('../../controllers/contacts-controller');
const validateBody = require('../../middlewares/index');

contactsRouter.get('/', contactsController.getAll)

contactsRouter.get('/:contactId', contactsController.getById)

contactsRouter.post('/', validateBody, contactsController.add)

contactsRouter.put('/:contactId', validateBody, contactsController.updateById)

contactsRouter.delete('/:contactId', contactsController.deleteById)

module.exports = contactsRouter;
