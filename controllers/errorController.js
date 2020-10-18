const AppError = require('../utils/appError');

const handleCastErrDB = err => new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDupFieldsDB = err => {
	const field = err.message.match(/(["'])(\\?.)*?\1/)[0];
	return new AppError(`Duplicate field value: ${field}. Please use an other value.`, 400);
}

const handleValidationErrorDB = err => {
	const errors = Object.values(err.errors).map(val => val.message)
	return new AppError(`Invalid input data: ${errors.join('. ')}`, 400)
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
		console.log("ERROR :japanese_goblin:", error)
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

		// Get req with unexisting id
		if (error.name === 'CastError') err = handleCastErrDB(err);

		// Post with a duplicate fied
		if (error.code === 11000) err = handleDupFieldsDB(error)

		// Validation errors: short name, min max rating, difficulty
		if (error.name === 'ValidationError') err = handleValidationErrorDB(error)

		sendProdError(err, res)
	}

}