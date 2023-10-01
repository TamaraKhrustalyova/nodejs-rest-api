const express = require('express');
const Joi = require('joi');

const contactsService = require('../../models/contacts');
const { HttpError } = require('../../helpers/index');


const contactsRouter = express.Router();

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

contactsRouter.get('/', async (req, res, next) => {
  try{
    const result = await contactsService.listContacts();
    res.json(result);
  }
  catch(error){
    next(error);
  }
})

contactsRouter.get('/:contactId', async (req, res, next) => {
  try{
    const {id} = req.params;
    const result = await contactsService.getContactById(id);
    if(!result) {
      throw HttpError(404, `There's no contact with the id ${id}`);
    }
    res.json(result);
  }
  catch(error){
    next(error);
  }
})

contactsRouter.post('/', async (req, res, next) => {
  try{
    if(!Object.keys(req.body).length) {
      throw HttpError(400, 'All fields are empty');
    }
    const {error} = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
  }
  catch(error){
    next(error);
  }
})

contactsRouter.put('/:contactId', async (req, res, next) => {
  try{
    if(!Object.keys(req.body).length) {
      throw HttpError(400, 'missing fields');
    }
    const {error} = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    const {id} = req.params;
    const result = await contactsService.updateContact(id, req.body);
    if(!result) {
      throw HttpError(404, `There's no contact with the id ${id}`);
    }
    res.json(result);
  }
  catch(error){
    next(error);
  }
})

contactsRouter.delete('/:contactId', async (req, res, next) => {
  try{
    const {id} = req.params;
    const result = await contactsService.removeContact(id);
    if(!result) {
      throw HttpError(404, `There's no contact with the id ${id}`);
    }
    res.json({message: "contact deleted"})
  }
  catch(error){
    next(error);
  }
})

module.exports = contactsRouter;
