const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({
  path: './config.env',
});

// Connection to DB
const db = process.env.DB.replace('<PASSWORD>', process.env.DB_PASS)

mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true

}).then(() => console.log("DB connection Successful"));

// App running
const app = require('./app');
const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`App listen at port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection. Shooting down...', err.name, err.message);
  server.close(() => {
    process.exit(1) // TODO: the server hangs. Neets a way to restatrt
  })
})
