const Joi = require('joi');

const contactsService = require('../models/contacts');
const { HttpError } = require('../helpers/index');
const { ctrlWrapper } = require('../decorators/index');

const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `missing required "name" field`
  }), 
  email: Joi.string().required().messages({
    "any.required": `missing required "email" field`
  }),  
  phone: Joi.string().required().messages({
    "any.required": `missing required "phone" field`
  }), 
})

const getAll = async (req, res) => {
      const result = await contactsService.listContacts();
      res.json(result);
  }

  const getById = async (req, res) => {
      const { id } = req.params;
      const result = await contactsService.getContactById(id);
      if(!result) throw HttpError(404, "Not found");
      
      res.json(result);
  }

  const add = async (req, res) => {
      const {error} = contactAddSchema.validate(req.body);
      if (error) {
        throw HttpError(400, "missing fields");
      }
      const result = await contactsService.addContact(req.body);
      res.status(201).json(result);
  }

  const updateById = async (req, res) => {
      const {error} = contactAddSchema.validate(req.body);
      if (error) {
        throw HttpError(400, "missing fields");
      }
  
      const {id} = req.params;
      const result = await contactsService.updateContact(id, req.body);
      if(!result) {
        throw HttpError(404, `There's no contact with the id ${id}`);
      }
      res.json(result);
  }

  const deleteById = async (req, res) => {
      const {id} = req.params;
      const result = await contactsService.removeContact(id);
      if(!result) {
        throw HttpError(404, `There's no contact with the id ${id}`);
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