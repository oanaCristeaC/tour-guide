const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

// User logic
exports.signUp = catchAsync(async (req, res, next) => {

  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });

  const jwtToken = jwt.sign({ id: newUser._id }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRES_IN })

  res.status(200).json({
    status: 'Succes',
    data: {
      name: newUser.name,
      email: newUser.email,
      jwtToken
    }
  })
});



exports.checkId = (req, res, next, val) => {
  const id = req.param.id;

  if (!id) {
    return res.sendStatus(404);
  }
};

exports.getUsers = (req, res) => {
  res.sendStatus(500);
};

exports.createUser = (req, res) => {
  res.sendStatus(500);
};

exports.getUser = (req, res) => {
  res.sendStatus(500);
};

exports.deleteUser = (req, res) => {
  res.sendStatus(500);
};

exports.updateUser = (req, res) => {
  res.sendStatus(500);
};
