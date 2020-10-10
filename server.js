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

app.listen(port, () => {
  console.log(`App listen at port ${port}`);
});
