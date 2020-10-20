const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync')

// User logic
exports.signUp = catchAsync(async (req, res, next) => {

  const newUser = await User.create(req.body);
  res.status(200).json({
    status: 'Succes',
    data: {
      newUser
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
