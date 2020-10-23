const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const loginToken = id => {
	return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRES_IN })
}

// User logic
exports.signUp = catchAsync(async (req, res, next) => {

	const { name, email, role, password, passwordConfirm, passChanged } = req.body
	const newUser = await User.create({ name, email, password, role, passwordConfirm, passChanged });
	const jwtToken = loginToken(newUser._id)

	res.status(200).json({
		status: 'Succes',
		data: {
			name: newUser.name,
			role: newUser.role,
			email: newUser.email,// this is as an extra check to the select:false
			passChanged: newUser.passChanged,
			jwtToken
		}
	})
});

exports.signin = catchAsync(async (req, res, next) => {
	// Check if email and password provided
	const { email, password } = req.body;

	if (!email || !password) return next(new AppError('Please provide email and password', 400));

	//Check if user exists and the password is ok
	const user = await User.findOne({ email }).select('+password'); // get user based on email address

	if (!user || !(await user.checkPass(password, user.password))) return next(new AppError('Incorrect username or password', 401));

	const token = loginToken(user._id)
	// If everything ok return login
	res.status(200).json({
		status: 'Success',
		data: {
			token
		}
	})

});

exports.protect = catchAsync(async (req, res, next) => {

	// 1. Getting token and check if it's there
	let tokenHeader = req.headers.authorization;
	let token;

	if (tokenHeader && tokenHeader.startsWith('Bearer')) {
		token = tokenHeader.split(' ')[1]
	}
	// 2. Verify token
	if (!token) {
		return next(new AppError('You are not logged in. Please log in!', 401));
	}
	const decoded = jwt.verify(token, process.env.JWT_KEY) // TODO: promisify?

	// 3. Check if owner of the token is still a registered user
	const tokenOwner = await User.findOne({ _id: decoded.id });

	if (!tokenOwner) return next(new AppError("User with this token does not exist.", 401));


	// 4. Check if the user change pasword after the token was issued
	const changed = await tokenOwner.changedPassAfterToken(decoded.iat)
	if (changed) {
		return next(new AppError("Your password changed. Please sing in again.", 401))
	}

	req.user = tokenOwner;

	next();
});

// Allow only to admin and tour-lead 
exports.restrictTo = (...params) => {
	return (req, res, next) => {
		if (!params.includes(req.user.role)) {
			return next(new AppError("You are not allowd to detele this tour.", 403))
		};
		next();
	};
}


