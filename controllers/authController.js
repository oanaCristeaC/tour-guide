const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');

/**
 *
 * @loginToken
 * @param {*} id
 *
 */
const loginToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 *
 * @createAndSendToken
 * @param {*} user
 * @param {*} statusCode
 * @param {*} res
 * @param {*} options
 *
 */
const createAndSendToken = (user, statusCode, res, options = {}) => {
  user.password = undefined;
  const jwtToken = loginToken(user._id);

  const cookieJWT = {
    httpOnly: true,
    expires:
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000, // to millisecond: h m s mils
  };

  if (process.env.NODE_ENV === 'production') cookieJWT.secure = true;

  res.cookie('jwt', cookieJWT);
  res.status(statusCode).json({
    status: 'Success',
    data: {
      jwtToken,
      user,
      ...options,
    },
  });
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

/**
 *
 * @signUp
 *
 */
exports.signUp = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    role,
    password,
    passwordConfirm,
    passChanged,
  } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    role,
    passwordConfirm,
    passChanged,
  });

  createAndSendToken(newUser, 201, res);
});

/**
 *
 * @signIn
 * 1. Check if email and password provided
 * 2. Check if user exists and the password is ok
 *
 */

// TODO: Limit the request to 10 tries then allows tries in 1 h
exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  const user = await User.findOne({ email }).select('+password'); // get user based on email address
  if (!user || !(await user.checkPass(password, user.password)))
    return next(new AppError('Incorrect username or password', 401));

  createAndSendToken(user, 200, res);
});

/**
 *
 * @protect a route
 * 1. Getting token and check if it's there
 * 2. Verify token
 * 3. Check if owner of the token is still a registered user
 * 4. Check if the user change password after the token was issued
 *
 */

exports.protect = catchAsync(async (req, res, next) => {
  let tokenHeader = req.headers.authorization;
  let token;

  if (!tokenHeader)
    return next(new AppError('You are not logged in. Please log in!', 401));
  if (tokenHeader && tokenHeader.startsWith('Bearer'))
    token = tokenHeader.split(' ')[1];
  if (!token)
    return next(new AppError('You are not logged in. Please log in!', 401));

  const decoded = jwt.verify(token, process.env.JWT_KEY); // TODO: promisify?
  const tokenOwner = await User.findOne({ _id: decoded.id });

  if (!tokenOwner)
    return next(new AppError('User with this token does not exist.', 401));

  const changed = await tokenOwner.changedPassAfterToken(decoded.iat);
  if (changed)
    return next(
      new AppError('Your password changed. Please sing in again.', 401)
    );

  req.user = tokenOwner;
  next();
});

// Allow only to admin and tour-lead
exports.restrictTo = (...params) => {
  return (req, res, next) => {
    if (!params.includes(req.user.role))
      return next(
        new AppError('You are not allowed to delete this tour.', 403)
      );

    next();
  };
};

/**
 *
 * @forgotPassword
 * 1. Get user
 * 2. Generate a temporary pass
 * 3. Save it to data base encrypted
 * 4. Generate reset pass link with the token
 * 5. Send forgot pass email with a reset link
 *
 */

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  const response = {
    status: 'Success',
    message:
      'If there is an account with this email, you should have received an email to reset your pass.',
  };

  //if (!user) return next(new AppError("There is not an account with this email address.", 403)) // Not good idea for security reason
  if (!user) return res.status(201).json({ response });

  const tempToken = user.generateTempToken();
  await user.save({ validateBeforeSave: false });

  const link = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${tempToken}`;
  const message = `Have you forgotten your password?\nUse the this link ${link} to reset it.\n
									If you haven't request a reset of your password, ignore this message.`;

  const emailOptions = {
    subject: 'Reset password',
    message,
  };

  try {
    await sendEmail(emailOptions);
    res.status(200).json({ response });
  } catch (error) {
    //this.user.passChanged = undefined; //??
    this.user.tempEncrpToken = undefined;
    this.user.tempTokenExpiration = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error resetting your password. Please try again later!',
        500
      )
    );
  }
});

/**
 *
 * @resetPassword
 *
 */

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Get the user based on encrypted token
  const tempEncrpToken = crypto
    .createHash('sha256')
    .update(req.params.tempToken)
    .digest('hex');
  const user = await User.findOne({
    tempEncrpToken,
    tempTokenExpiration: { $gt: Date.now() },
  });

  if (!user)
    return next(
      new AppError(
        'Your link is invalid or expired. Please request a new password again.',
        400
      )
    );

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.tempEncrpToken = undefined;
  user.tempTokenExpiration = undefined;
  //passChanged is updated on pre.save

  const options = {
    message: 'Your password was successfully updated.',
  };

  await user.save();
  createAndSendToken(user, 201, res, options);
});

/**
 *
 * @updatePassword
 * 1. Get the user
 * 2. Check if provided pass is valid
 * 3. Update the old pass
 *
 */

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById({ _id: req.user._id }).select('+password');

  if (!req.body.currentPassword)
    return next(new AppError('Please provide the current password.', 400));
  if (!req.body.password || !req.body.passwordConfirm)
    return next(
      new AppError(
        'Please provide new password and confirmation password.',
        400
      )
    );
  if (!user || !(await user.checkPass(req.body.currentPassword, user.password)))
    return next(new AppError('Incorrect username or password', 401));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.tempEncrpToken = undefined;
  user.tempTokenExpiration = undefined;
  //passChanged is updated on pre.save
  const options = {
    message: 'Your password was successfully updated.',
  };

  await user.save();
  createAndSendToken(user, 201, res, options);
});

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
