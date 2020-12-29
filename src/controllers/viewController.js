const catchAsync = require('../utils/catchAsync');
const Bookings = require('../models/bookingModel');
const Tour = require('../models/tourModel');

// TODO: test this
exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Bookings.find({ user: req.user.id });
  const tourIds = bookings.map((el) => el.tour); // tour here is the tour id

  const tours = await Tour.find({ id: { $in: tourIds } });

  res.status(200).json({
    status: 'Success',
    data: {
      tours,
    },
  });
});

exports.getAccount = (req, res) => {
  res.render('auth/login', {
    title: 'Your account'
  })
}

exports.createAccount = (req, res) => {
  res.render('auth/register', {
    title: 'Create an account'
  })
}
