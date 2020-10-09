const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({
  path: './config.env',
});

const db = process.env.DB.replace('<PASSWORD>', process.env.DB_PASS)

mongoose.connect(db, {
//mongoose.connect(process.env.DB_LOCAL, {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: true
}).then(con => {
  // console.log(con.connection)
  console.log("app running")
})

const app = require('./app');

const port = process.env.PORT || 8000;

// App running
app.listen(port, () => {
  console.log(`App listen at port ${port}`);
});
