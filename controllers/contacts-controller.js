const {Contact} = require('../models/Contact');
const {HttpError}  = require('../helpers/index');
const { ctrlWrapper } = require('../decorators/index');


const getAll = async (req, res) => {
      const {_id: owner} = req.user;
      const {page = 1, limit = 10, favorite} = req.query;
      const skip = (page - 1) * limit;
      if(favorite){
        const result = await Contact.find({owner, favorite}, {}, {skip, limit}).populate("owner", "email");
        res.json(result)
      } else {
        const result = await Contact.find({owner}, {}, {skip, limit}).populate("owner", "email");
        res.json(result);
      }
      
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
      const result = await Contact.create({...req.body, owner});
      res.status(201).json(result);
  }

  const updateById = async (req, res) => {
      const {_id: owner} = req.user;
      const {contactId} = req.params;
      const result = await Contact.findOneAndUpdate({_id: contactId, owner}, req.body);
      if(!result) {
        throw HttpError(404, `Not found`);
      }
      res.json(result);
  }

  const updateStatusContact = async (req, res) => {
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