const {Schema, model} = require('mongoose');
const {handleSaveError, runValidationAtUpdate} = require('./hooks');

const Joi = require('joi');

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const subscriptionOption = ["starter", "pro", "business"]

const userSchema = new Schema({
    email: {
        type: String, 
        match: emailRegexp,
        unique: true,
        required: [true, 'Email is required'],
    }, 
    password: {
        type: String, 
        required: [true, 'Set password for user'],
    }, 
    subscription: {
        type: String,
        enum: subscriptionOption,
        default: "starter"
      },
    token: {
        type: String,
    },
    avatarURL: {
      type: String,
    }
}, {versionKey: false, timestamps: true})

userSchema.post("save", handleSaveError);
userSchema.pre("findOneAndUpdate", runValidationAtUpdate);
userSchema.post("findOneAndUpdate", handleSaveError);

const userRegisterSchema = Joi.object({
    subscription: Joi.string()
      .valid(...subscriptionOption),
    email: Joi.string()
      .pattern(emailRegexp)
      .required(),  
    password: Joi.string()
      .required() 
  })
  
  const userLoginSchema = Joi.object({
    email: Joi.string()
      .pattern(emailRegexp)
      .required()
      .messages({
          "any.required": `missing required "email" field`,
      }),  
    password: Joi.string()
      .required()
      .messages({
          "any.required": `missing required "password" field`,
      }), 
   }) 
  
const userUpdateSubscription = Joi.object({
    subscription: Joi.string().required().valid(...subscriptionOption)
})

const User = model('user', userSchema);

module.exports = {
    User, 
    userRegisterSchema,
    userLoginSchema, 
    userUpdateSubscription,
}