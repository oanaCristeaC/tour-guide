const User = require('../models/userModel');
const factory = require('./handlerFactory');

exports.checkId = (req, res, next, val) => {
  const id = req.param.id;

  if (!id) {
    return res.sendStatus(404);
  }
};

exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);
exports.getUsers = factory.getAll(User);
