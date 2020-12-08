class AppError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith('4') ? 'Failed' : 'Error'
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = AppError;