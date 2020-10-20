const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Username field is required.'],
		unique: false, //?,
		minlength: [2, 'A name must have a min length of 2 characters.'],
		maxlength: [40, 'A name must have a max length of 40 characters.']
	},
	email: {
		type: String,
		required: [true, 'Email field is required'],
		unique: true,
		lowercase: true,
		validate: [validator.isEmail, 'Please provide a vlaid email address.']
	},
	password: {
		type: String,
		required: [true, 'Password field is required'],
		minlength: [7, 'A password must have a min length of 7 characters.'],
		maxlength: [40, 'A name must have a max length of 40 characters.'],
		select: false
	},
	photo: String,
	passwordConfirm: {
		type: String,
		required: [true, 'Please re-type your password.'],
		validate: {
			// This works only on Create and Save. Update user must use save not update
			validator: function (el) {
				return el === this.password
			},
			message: 'Passwords are not the same.'
		},
	},
});

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	const salt = await bcrypt.genSalt(12)
	this.password = await bcrypt.hash(this.password, salt)

	this.passwordConfirm = undefined;
	//this.password = await bcrypt.hash(this.password, 12)
});

userSchema.methods.checkPass = async function (providedPass, userPass) {
	return bcrypt.compare(providedPass, userPass)
}

const User = mongoose.model('User', userSchema);
module.exports = User;