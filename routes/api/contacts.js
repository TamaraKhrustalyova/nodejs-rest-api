const express = require('express');
const contactsRouter = express.Router();
const contactsController = require('../../controllers/contacts-controller');
const { isEmptyBody, isValidId, authenticate } = require('../../middlewares/index');
const { validateBody } = require('../../decorators/index');
const { contactAddSchema, contactUpdateFavoriteSchema } = require('../../models/Contact');

const contactAddValidate = validateBody(contactAddSchema);
const contactUpdateFavoriteValidate = validateBody(contactUpdateFavoriteSchema);

contactsRouter.use(authenticate);

contactsRouter.get('/', contactsController.getAll)

contactsRouter.get('/:contactId', isValidId, contactsController.getById)

contactsRouter.post('/', isEmptyBody, contactAddValidate, contactsController.add)

contactsRouter.put('/:contactId', isValidId, isEmptyBody, contactAddValidate, contactsController.updateById)

contactsRouter.patch("/:contactId/favorite", isValidId, contactUpdateFavoriteValidate, contactsController.updateStatusContact)

contactsRouter.delete('/:contactId', isValidId, contactsController.deleteById)

module.exports = contactsRouter;
