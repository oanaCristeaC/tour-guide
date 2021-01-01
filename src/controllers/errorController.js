import AppError from '../utils/appError.js';

const handleCastErrDB = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDupFieldsDB = (err) => {
  const field = err.message.match(/(["'])(\\?.)*?\1/)[0];
  return new AppError(
    `Duplicate field value: ${field}. Please use an other value.`,
    400
  );
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  return new AppError(`Invalid input data: ${errors.join('. ')}`, 400);
};

const invalidTokenErr = () =>
  new AppError('Invalid signature. Please sign in again.', 401);
const expiredTokenErr = () =>
  new AppError('Your token has expired. Please sign up again.', 401);

const sendDevError = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
    err: error,
    name: error.name,
    stack: error.stack,
  });
};

const sendProdError = (error, res) => {
  // Operational trusted error
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    // Unknown programming error which we dont want to leak to the client
    console.log('ERROR :japanese_goblin:', error); // TODO: remove
    res.status(500).json({
      status: 'Error',
      message: 'Something went wrong!',
    });
  }
};

export const errorController= (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'Error';

  if (process.env.NODE_ENV === 'development') {
    sendDevError(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    let err = { ...error };

    // Get req with unexisting id
    if (err.name === 'CastError') err = handleCastErrDB(error);

    // Post with a duplicate fied
    if (err.code === 11000) err = handleDupFieldsDB(error);

    // Validation errors: short name, min max rating, difficulty
    if (err.name === 'ValidationError') err = handleValidationErrorDB(error);

    // Token validation
    if (err.name === 'JsonWebTokenError') err = invalidTokenErr();
    if (err.name === 'TokenExpiredError') err = expiredTokenErr();

    sendProdError(err, res);
  }
};
