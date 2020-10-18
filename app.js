const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

const toursRouter = require('./routers/tourRouters');
const usersRouter = require('./routers/userRouters');
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'Failed',
        message: `Can't find ${req.originalUrl}`
    })
})

module.exports = app;