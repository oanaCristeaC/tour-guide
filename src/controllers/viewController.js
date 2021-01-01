import catchAsync from '../utils/catchAsync.js';
import Bookings from '../models/bookingModel.js';
import Tour from '../models/tourModel.js';

// TODO: test this
export const getMyTours = catchAsync(async (req, res, next) => {
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

export const getAccount = (req, res) => {
  res.render('auth/login', {
    title: 'Your account'
  })
}

export const createAccount = (req, res) => {
  res.render('auth/register', {
    title: 'Create an account'
  })
}
