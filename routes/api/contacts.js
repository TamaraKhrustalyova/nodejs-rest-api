const express = require('express');
const contactsRouter = express.Router();
const contactsController = require('../../controllers/contacts-controller');
const { isEmptyBody, isValidId, authenticate } = require('../../middlewares/index');

contactsRouter.use(authenticate);

contactsRouter.get('/', contactsController.getAll)

contactsRouter.get('/:contactId', isValidId, contactsController.getById)

contactsRouter.post('/', isEmptyBody, contactsController.add)

contactsRouter.put('/:contactId', isValidId, isEmptyBody, contactsController.updateById)

contactsRouter.patch("/:contactId/favorite", isValidId, contactsController.updateStatusContact)

contactsRouter.delete('/:contactId', isValidId, contactsController.deleteById)

module.exports = contactsRouter;