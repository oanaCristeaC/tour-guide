const User = require('../models/userModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // null if no error
    cb(null, 'public/img/users');
  },
  filename: (req, file, cb) => {
    // file here has the same val as the req.file on the controller
    const fileType = file.mimetype.split('/')[1]; // TODO: accept only jpg, png or jpeg
    // Include the user id into the filename to make sure the filename is unique across all users
    cb(null, `user-${req.user._id}-${Date.now()}.${fileType}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image'))
    cb(new AppError('Please use only images.', 400));
  cb(null, true);
};

const upload = multer({ storage, fileFilter });
exports.uploadPhoto = upload.single('photo');

/**
 * @checkId checks if id params set
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} val
 */

exports.checkId = (req, res, next, val) => {
  const id = req.param.id;

  if (!id) {
    return res.sendStatus(404);
  }
};

/**
 *
 * @filterData returns keys with given params value
 * @param {*} data
 * @param  {...any} params
 *
 */

const filterData = (data, params) => {
  const newObject = {};
  Object.keys(data).forEach((el) => {
    if (params.includes(el)) newObject[el] = data[el];
  });

  return newObject;
};

exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);
exports.getUsers = factory.getAll(User);

/**
 * @getUserId gets the user id from the login and sets it to the params.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.getUserId = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

/**
 *
 * @updateMe updates user info except the password
 *
 */
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError('To update password use update-password route.', 400)
    );

  const options = ['name', 'email'];
  const data = filterData(req.body, options);
  if (req.file) data.photo = req.file.filename;

  const user = await User.findByIdAndUpdate({ _id: req.user._id }, data, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({ user });
});

/**
 *
 *  @deleteMe sets an user to inactive
 *
 */

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate({ _id: req.user._id }, { active: false });

  res.status(204).json({
    status: 'Success',
    data: null,
  });
});
