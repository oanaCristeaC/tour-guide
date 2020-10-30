const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Username field is required.'],
    unique: false, //?,
    minlength: [2, 'A name must have a min length of 2 characters.'],
    maxlength: [40, 'A name must have a max length of 40 characters.'],
  },
  email: {
    type: String,
    required: [true, 'Email field is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address.'],
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  photo: String,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  password: {
    type: String,
    required: [true, 'Password field is required'],
    minlength: [7, 'A password must have a min length of 7 characters.'],
    maxlength: [40, 'A name must have a max length of 40 characters.'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passChanged: Date,
  tempEncrpToken: String,
  tempTokenExpiration: Date,
});

/**
 *
 * Hash the password before being saved
 *
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  this.passwordConfirm = undefined;
  //this.password = await bcrypt.hash(this.password, 12)
});

/**
 *
 * Update password changed date on save
 *
 */
userSchema.pre('save', async function (next) {
  if (this.isNew || !this.isModified('password')) return next();
  this.passChanged = Date.now() - 1000; // This is in case the token is generated few milliseconds before save
  next();
});

/**
 *
 * @checkPass check if provided password matches to the one stored on db
 * @param {*} providedPass
 * @param {*} userPass
 *
 */
userSchema.methods.checkPass = async function (providedPass, userPass) {
  return bcrypt.compare(providedPass, userPass);
};

/**
 *
 * @changedPassAfterToken
 * @param {*} JWTTimeStamp
 *
 */
userSchema.methods.changedPassAfterToken = async function (JWTTimeStamp) {
  if (this.passChanged) return JWTTimeStamp < this.passChanged.getTime() / 1000;

  return false;
};

/**
 *
 * @generateTempToken
 *
 */
userSchema.methods.generateTempToken = function () {
  const tempToken = crypto.randomBytes(32).toString('hex');
  this.tempEncrpToken = crypto
    .createHash('sha256')
    .update(tempToken)
    .digest('hex');
  this.tempTokenExpiration = Date.now() + 10 * 60 * 1000; // 10 min extra

  return tempToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
