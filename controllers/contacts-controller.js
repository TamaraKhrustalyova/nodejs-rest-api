const contactsService = require('../models/contacts');
const { HttpError } = require('../helpers/index');
const { ctrlWrapper } = require('../decorators/index');
const contactAddSchema = require('../schemas/contacts-schemas');

const getAll = async (req, res) => {
      const result = await contactsService.listContacts();
      res.json(result);
  }

  const getById = async (req, res) => {
      const { contactId } = req.params;
      const result = await contactsService.getContactById(contactId);
      if(!result) throw HttpError(404, "Not found");
      
      res.json(result);
  }

  const add = async (req, res) => {
      const {error} = contactAddSchema.validate(req.body);
      if (error) {
        throw HttpError(400, error.message);
      }
      const result = await contactsService.addContact(req.body);
      res.status(201).json(result);
  }

  const updateById = async (req, res) => {
      const {error} = contactAddSchema.validate(req.body);
      if (error) {
        throw HttpError(400, error.message);
      }
  
      const {contactId} = req.params;
      const result = await contactsService.updateContact(contactId, req.body);
      if(!result) {
        throw HttpError(404, `Not found`);
      }
      res.json(result);
  }

  const deleteById = async (req, res) => {
      const {contactId} = req.params;
      const result = await contactsService.removeContact(contactId);
      if(!result) {
        throw HttpError(404, `Not found`);
      }
      res.json({message: "contact deleted"})
  }

  module.exports = {
    getAll: ctrlWrapper(getAll), 
    getById: ctrlWrapper(getById), 
    add: ctrlWrapper(add), 
    updateById: ctrlWrapper(updateById), 
    deleteById: ctrlWrapper(deleteById), 
  }