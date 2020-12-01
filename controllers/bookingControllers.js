const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  // Create a session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',

    /**
     * This is not a secure implementation and it's only used for testing purpose.
     * On production mode (when have access to it)
     * USE STRIPE WEB HOOKS instead, to create a booking session.
     */
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,

    cancel_url: `${req.protocol}://${req.get('host')}/tours/`,

    // https://stripe.com/docs/payments/accept-a-payment#prefilling-customer-data
    customer_email: req.user.email, // data available from protected route

    // TODO:
    client_reference_id: req.params.tourId,
    // product data
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `${tour.name}`,
            description: `${tour.summery}`,
            images: [
              `https://images.all-free-download.com/images/graphiclarge/goa_small_bird_202958.jpg`,
            ], //TODO live images
          },
          unit_amount: `${tour.price} ` * 100, //A non-negative integer in cents
        },
        quantity: 1, //one tour
      },
    ],
  });

  res.status(200).json({
    status: 'Success',
    session,
  });
});

// Used in view controller WIP
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // TEMPORARY use as not secured
  const { user, tour, price } = req.query;

  if (!user && !tour && !price) return next(); // next is getOverview page

  await Booking.create({ user, tour, price });
  res.redirect(req.originalUrl.split('?')[0]);
});
