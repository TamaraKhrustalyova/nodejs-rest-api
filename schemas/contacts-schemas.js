const Joi = require('joi');

const contactAddSchema = Joi.object({
    name: Joi.string()
      .min(2)
      .max(15)
      .required()
      .messages({
          "any.required": `missing required "name" field`,
          'string.min': `"name" should have a minimum length of {#limit}`,
          'string.max': `"name" should have a maximim length of {#limit}`
       }), 
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required()
      .messages({
          "any.required": `missing required "email" field`
      }),  
    phone: Joi.string()
      .length(10)
      .regex(/^[0-9]{10}$/).message(`'phone' number must only consist of digits`)
      .required()
      .messages({
          "any.required": `missing required "phone" field`,
      }), 
  })

  module.exports = contactAddSchema;