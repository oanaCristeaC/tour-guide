import dotenv from 'dotenv';
import mongoose from 'mongoose';

// process.on('uncaughtException', err => {
//   console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
//   console.log(err.name, err.message);
//   process.exit(1);
// }); // TODO: this does not work as expected

dotenv.config({
  path: './config.env',
});

// Connection to DB
const db = process.env.DB.replace('<PASSWORD>', process.env.DB_PASS);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection Successful'));

// App running
import app from './src/app.js';
const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`App listen at port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
