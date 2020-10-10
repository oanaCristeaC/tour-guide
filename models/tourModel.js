const mongoose = require('mongoose');

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
  
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour
