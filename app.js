const express = require('express');
const app = express();
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController')
const morgan = require('morgan');

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

const toursRouter = require('./routers/tourRouters');
const usersRouter = require('./routers/userRouters');
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

// Handle all unset routers
app.all('*', (req, res, next) => {
	next(new AppError(`Route ${req.originalUrl} can't be found.`, 404));
});

// Error handelling middleware
app.use(errorController);

module.exports = app;