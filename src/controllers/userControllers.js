import User from '../models/userModel.js';
import factory from './handlerFactory.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import multer from 'multer';
import sharp from 'sharp';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image'))
    cb(new AppError('Please use only images.', 400));
  cb(null, true);
};

const upload = multer({ storage, fileFilter });
export const uploadPhoto = upload.single('photo');

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user._id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

/**
 * @checkId checks if id params set
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} val
 */

export const checkId = (req, res, next, val) => {
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

export const deleteUser = factory.deleteOne(User);
export const updateUser = factory.updateOne(User);
export const getUser = factory.getOne(User);
export const createUser = factory.createOne(User);
export const getUsers = factory.getAll(User);

/**
 * @getUserId gets the user id from the login and sets it to the params.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const getUserId = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

/**
 *
 * @updateMe updates user info except the password
 *
 */
export const updateMe = catchAsync(async (req, res, next) => {
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

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate({ _id: req.user._id }, { active: false });

  res.status(204).json({
    status: 'Success',
    data: null,
  });
});
