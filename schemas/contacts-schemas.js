const Joi = require('joi');

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
      .pattern(/^\(\d{3}\) \d{3}-\d{4}$/)
      .required()
      .messages({
          "any.required": `missing required "phone" field`,
      }), 
  })

  module.exports = contactAddSchema;