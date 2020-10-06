const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/** Routers */
// app.get('/', (req, res) => {
//   res.send('Hello wold');
// });

const toursRouter = require('./routers/tourRouters');
const usersRouter = require('./routers/userRouters');
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

module.exports = app;