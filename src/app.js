const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const path = require('path');
const AppError = require('./utils/appError');
const errorController = require('./controllers/errorController');

//Security
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Routers
const toursRouter = require('./routers/tourRouters');
const usersRouter = require('./routers/userRouters');
const reviewsRouter = require('./routers/reviewRouters');
const bookingRouter = require('./routers/bookingRoute');
const viewRouter = require('./routers/viewRoutes');

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
// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});


// Template
// TODO: double check if main needs to be removed to use stripe
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));

app.set('view engine','hbs')
app.set('views', path.join(__dirname, 'views'))
// GLOBAL MIDDLEWARE to serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', viewRouter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/bookings', bookingRouter);

// Handle all unset routers
app.all('*', (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} can't be found.`, 404));
});

// Error chandelling middleware
app.use(errorController);

module.exports = app;
