const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({
  path: './config.env',
});

const db = process.env.DB.replace('<PASSWORD>', process.env.DB_PASS)

mongoose.connect(db, {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: true
}).then(() => console.log("DB connection Successful"));

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tour must have a name.'],
    unique: true
  },
  ratting: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'Tour must have a price.']
  }
});

const Tour = mongoose.model('Tour', tourSchema)

const app = require('./app');

const port = process.env.PORT || 8000;

// App running
app.listen(port, () => {
  console.log(`App listen at port ${port}`);
});
