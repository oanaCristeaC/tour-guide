const express = require('express');
const app = express();
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set security headers
app.use(helmet());
app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));
// Data sanitization against NoSql attacks
//searches for any keys in objects that begin with a $ sign or contain a .,
//from req.body, req.query or req.params
app.use(mongoSanitize());
/* make sure this comes before any routes */
// Data sanitization against XSS (cross sides scripts) attacks
app.use(xss());
//protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      'ratingsAverage',
      'startDates',
      'duration',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

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
