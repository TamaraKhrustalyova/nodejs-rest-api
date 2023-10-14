const {Schema, model} = require('mongoose');
const {handleSaveError, runValidationAtUpdate} = require('./hooks');

const Joi = require('joi');

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
    username: {
        type: String, 
        required: true,
    }, 
    email: {
        type: String, 
        match: emailRegexp,
        required: true,
    }, 
    password: {
        type: String, 
        minlength: 8,
        required: true, 
    }
}, {versionKey: false, timestamps: true})