const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../models/tourModel');

dotenv.config({
  path: './config.env',
});

// Connection to DB
const db = process.env.DB.replace('<PASSWORD>', process.env.DB_PASS);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection Successful'));

const importData = async (req, res) => {
  const data = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-complete.json`, 'utf-8')
  );

  try {
    await Tour.create(data);
    console.log('Data successfully imported.');
  } catch (error) {
    console.log('Error', error);
  }

  process.exit();
};

const deleteData = async (req, res) => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully delete.');
  } catch (error) {
    console.log('Error', error);
  }

  process.exit();
};

console.log(process.argv);

if (process.argv[2] === '-import') {
  importData();
}

if (process.argv[2] === '-delete') {
  deleteData();
}
