import express from 'express';
const app = express();
import exphbs from 'express-handlebars';
import path from 'path';
import AppError from './utils/appError.js';
import { errorController } from './controllers/errorController.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));

//Security
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

// Routers
import toursRouter from './routers/tourRouters.js';
import usersRouter from './routers/userRouters.js';
import reviewsRouter from './routers/reviewRouters.js';
import bookingRouter from './routers/bookingRoute.js';
import viewRouter from './routers/viewRoutes.js';

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
  extname: '.hbs'
}));

app.set('view engine','hbs')
app.set('views', path.join(__dirname, 'views'))
// GLOBAL MIDDLEWARE to serving static files
app.use(express.static(path.join(__dirname, '../public')));

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

export default app;
