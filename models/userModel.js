const mongoose = require('mongoose');
const validator = require('validator')

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Username field is required.'],
		unique: false, //?,
		minlength: [2, 'A name must have a min length of 2 characters.'],
		maxlength: [40, 'A name must have a max length of 40 characters.']
	},
	email: {
		type: email,
		required: [true, 'Email field is required'],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please provide a vlaid email address.']
	},
	password: {
		type: String,
		required: [true, 'Password field is required'],
		minlength: [7, 'A password must have a min length of 7 characters.'],
		maxlength: [40, 'A name must have a max length of 40 characters.']
	},
	photo: String,
	passwordConfirm: {
		type: String,
		required: [true, 'Please re-type your password.']
	}
})