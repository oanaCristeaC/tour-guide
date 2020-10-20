const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.checkId = (req, res, next, val) => {
  const id = req.param.id;

  if (!id) {
    return res.sendStatus(404);
  }
};

exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()

  res.status(200).json({
    status: 'Success',
    data: {
      users
    }
  })
});

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
