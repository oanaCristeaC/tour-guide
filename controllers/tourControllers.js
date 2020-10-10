const Tour = require('../models/tourModel')

exports.getTours = async (req, res) => {
  try {
    const tours = await Tour.find();

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
