const sendDevError = (error, res) => {
	res.status(error.statusCode).json({
		status: error.status,
		message: error.message,
		error,
		err: error.stck
	})
};

const sendProdError = (error, res) => {
	// Operational trusted error
	if (error.isOperational) {
		res.status(error.statusCode).json({
			status: error.status,
			message: error.message
		})
	} else {
		// Unknown programming error which we dont want to leak to the client
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
		sendProdError(error, res)
	}

}