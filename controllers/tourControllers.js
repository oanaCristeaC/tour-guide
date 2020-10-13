const Tour = require('../models/tourModel');

// limit=5&sort=-ratingsAverage,price
exports.aliasTopTours = async (req, res, next)=> {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name, ratingsAverage, price, summary';

  next();
}

exports.getTours = async (req, res) => {
  try {

    /** Filer the tours using 
     * @find returns only tours withing the query criteria
     * @param {object|objectId} - req.query: =, gt, gte, lt and lte
    */

    // Simple query filter; excluding: page, limit, sort and field
    const queryObj = { ...req.query};
    const excludedQuery = ['page', 'limit', 'sort', 'fields']; 
    excludedQuery.forEach(el => delete queryObj[el]); //TODO

    // Advance query filter with operators: gt, gte, lt and lte (duration[lte]=5)
    let queryStr = JSON.stringify(queryObj)

    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
    let query = Tour.find(JSON.parse(queryStr));

    /**Sort tour
     * @sort returns tours sorted on query criteria
     * @param {object|string} req.query.sort
    */

    if (req.query.sort) {
      // sort by 
      //query = query.sort(req.query.sort) // single sort
      const sortBy = req.query.sort.split(',').join(' ') // in url use comma, in mongo use space
      query = query.sort(sortBy) 
    } else {
      query = query.sort('-createdAt')
    }

    /** Field limiting 
     * @select returns only queried fields 
     * @param {object|string}: req.query.fields
    */
    if(req.query.fields) {

      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields)

    } else {
      query = query.select('-__v')
    }

    /** Pagination uses
     * @skip returns number of items to be skipped
     * @param {number} 
     * 
     * @limit returns the no of items to be displayed
     * @param {number}    
     **/
    const page = req.query.page * 1; //transform into a number
    const limit = req.query.limit * 1;
    const pageItems = (page - 1) * limit;
    //page 1 = 1-10 11-20 21 -30 31 -40

    if (req.query.page) {
      const noTours = await Tour.countDocuments();
      if (pageItems >= noTours) { throw new Error ('No tours found!') }
    }

    query = query.skip(pageItems).limit(limit);

    /** Return result */
    const tours = await query;
    res.status(200).json({
      status: 'Success',
      requests: tours.length,
      data: {
        tours
      },
    });
  } catch (error) {
    res.status(404).send(error)
  }
};

exports.createTour = async(req, res) => {
  try {
    const newTour = await Tour.create(req.body)

    res.status(200).json({
      status: 'Success',
      data: {
        newTour
      }
    })
  } catch (error) {
    res.status(404).send(error)
  }
};

exports.getTour = async (req, res) => {
  try {
    //console.log('tour', req.params.id);
    const tour = await Tour.findById(req.params.id)

    res.status(200).json({
      status: 'Success',
      data: {
        tour,
      },
    });
  } catch (error) {

    res.status(404).json({
      status: 'Failed',
      message: error
    })
  }
};

exports.updateTour = async (req, res) => {

  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'Updated',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'Failed',
      message: error
    })
  }
};

exports.deleteTour = async(req, res) => {
  
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'Deleted',
      data: {
        tour: null,
      },
    });

  } catch (error) {
    res.status(404).json({
      status: 'Failed',
      message: error
    })
  }
};
