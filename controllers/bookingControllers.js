const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  // Create a session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `https://localhost:3000/`, //`${req.protocol}/${req.get('host')}/api/v1/`,
    cancel_url: `https://localhost:3000/`, //`${req.protocol}/${req.get('host')}/api/v1/tours/`,
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
