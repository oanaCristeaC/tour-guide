const AppError = require('../utils/appError');

const handleCastDB = err => new AppError(`Invalid ${err.path}: ${err.value}`, 400);
const handleDupFieldsDB = err => {

	const field = err.message.match(/(["'])(\\?.)*?\1/)[0];

	return new AppError(`Duplicate field value: ${field}. Please use an other value.`, 400);
}

const sendDevError = (error, res) => {
	res.status(error.statusCode).json({
		status: error.status,
		message: error.message,
		err: error,
		name: error.name,
		stack: error.stack
	})
};

const sendProdError = (error, res) => {
	// Operational trusted error
	if (error.isOperational) {
		res.status(error.statusCode).json({
			status: error.status,
			message: error.message,
		})
	} else {
		// Unknown programming error which we dont want to leak to the client
		console.log("eror", error)
		res.status(500).json({
			status: 'Error',
			message: 'Something went wrong!'
		})
	}
}

module.exports = (error, req, res, next) => {
	error.statusCode = error.statusCode || 500;
	error.status = error.status || 'Error';

	if (process.env.NODE_ENV === 'development') {
		sendDevError(error, res)
	} else if (process.env.NODE_ENV === 'production') {

		let err = { ...error }

		if (error.name === 'CastError') {
			err = handleCastDB(err);

		} else if (error.code === 11000) {
			err = handleDupFieldsDB(error)
		}

		sendProdError(err, res)
	}

}