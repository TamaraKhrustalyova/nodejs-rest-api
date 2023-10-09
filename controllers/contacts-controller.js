const {Contact} = require('../models/Contact');
const { HttpError } = require('../helpers/index');
const { ctrlWrapper } = require('../decorators/index');
const {contactAddSchema, contactUpdateFavoriteSchema} = require('../models/Contact');

const getAll = async (req, res) => {
      const result = await Contact.find();
      res.json(result);
  }

  const getById = async (req, res) => {
      const { contactId } = req.params;
      const result = await Contact.findById(contactId);
      if(!result) throw HttpError(404, "Not found");
      
      res.json(result);
  }

  const add = async (req, res) => {
      const {error} = contactAddSchema.validate(req.body);
      if (error) {
        throw HttpError(400, error.message);
      }
      const result = await Contact.create(req.body);
      res.status(201).json(result);
  }

  const updateById = async (req, res) => {
      const {error} = contactAddSchema.validate(req.body);
      if (error) {
        throw HttpError(400, error.message);
      }
      const {contactId} = req.params;
      const result = await Contact.findByIdAndUpdate(contactId, req.body);
      if(!result) {
        throw HttpError(404, `Not found`);
      }
      res.json(result);
  }

  const updateStatusContact = async (req, res) => {
    const {error} = contactUpdateFavoriteSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body);
    console.log(contactId, req.body, result)
    if(!result) {
      throw HttpError(404, `Not found`);
    }
    res.json(result);
}

  const deleteById = async (req, res) => {
      const { contactId } = req.params;
      const result = await Contact.findByIdAndRemove(contactId);
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
    updateStatusContact: ctrlWrapper(updateStatusContact),
    deleteById: ctrlWrapper(deleteById), 
  }