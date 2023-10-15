const {Schema, model} = require('mongoose');
const {handleSaveError, runValidationAtUpdate} = require('./hooks');

const Joi = require('joi');

const phoneRegexp = /^\(\d{3}\) \d{3}-\d{4}$/;

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
      },
      email: {
        type: String,
        required: [true, 'Set email for contact'],
      },
      phone: {
        type: String,
        match: phoneRegexp,
        required: [true, 'Set phone number for contact'], 
      },
      favorite: {
        type: Boolean,
        default: false,
      },
}, {versionKey: false, timestamps: true});

contactSchema.post("save", handleSaveError);
contactSchema.pre("findOneAndUpdate", runValidationAtUpdate);
contactSchema.post("findOneAndUpdate", handleSaveError);


const contactAddSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .required()
    .messages({
        "any.required": `missing required "name" field`,
        'string.min': `"name" should have a minimum length of {#limit}`,
     }), 
  email: Joi.string()
    .email()
    .required()
    .messages({
        "any.required": `missing required "email" field`,
    }),  
  phone: Joi.string()
    .pattern(phoneRegexp)
    .required()
    .messages({
        "any.required": `missing required "phone" field`,
    }), 
  favorite: Joi.boolean()
})

const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean()
  .required()
  .messages({
    "any.required": `missing field favorite`,
 }), 
})

const Contact = model('contact', contactSchema);

module.exports = {
  Contact,
  contactAddSchema,
  contactUpdateFavoriteSchema,
};