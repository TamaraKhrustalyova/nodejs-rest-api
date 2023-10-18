const {Contact} = require('../models/Contact');
const { HttpError } = require('../helpers/index');
const { ctrlWrapper } = require('../decorators/index');
const {contactAddSchema, contactUpdateFavoriteSchema} = require('../models/Contact');

const getAll = async (req, res) => {
      const {_id: owner} = req.user;
      const {page = 1, limit = 20} = req.query;
      const skip = (page - 1)* limit;
      const result = await Contact.find({owner}, {skip, limit}).populate("owner", "username email");
      res.json(result);
  }

  const getById = async (req, res) => {
      const {_id: owner} = req.user;
      const { contactId } = req.params;
      const result = await Contact.findById({_id: contactId, owner});
      if(!result) throw HttpError(404, "Not found");
      
      res.json(result);
  }

  const add = async (req, res) => {
      const {_id: owner} = req.user;
      const {error} = contactAddSchema.validate(req.body);
      if (error) {
        throw HttpError(400, error.message);
      }
      const result = await Contact.create({...req.body, owner});
      res.status(201).json(result);
  }

  const updateById = async (req, res) => {
      const {error} = contactAddSchema.validate(req.body);
      if (error) {
        throw HttpError(400, error.message);
      }
      const {_id: owner} = req.user;
      const {contactId} = req.params;
      const result = await Contact.findOneAndUpdate({_id: contactId, owner}, req.body);
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
    const {_id: owner} = req.user;
    const { contactId } = req.params;
    const result = await Contact.findOneAndUpdate({_id: contactId, owner}, req.body);
    if(!result) {
      throw HttpError(404, `Not found`);
    }
    res.json(result);
}

  const deleteById = async (req, res) => {
      const {_id: owner} = req.user;
      const { contactId } = req.params;
      const result = await Contact.findOneAndDelete({_id: contactId, owner});
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