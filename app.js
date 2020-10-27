const express = require('express');
const app = express();
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
// Set security headers
app.use(helmet());
app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));

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
