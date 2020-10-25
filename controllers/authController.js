const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto')

const loginToken = id => {
	return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: process.env.JWT_EXPIRES_IN })
}

const createAndSendToken = (user, statusCode, res) => { // TODO: use this
	const jwtToken = loginToken(user._id)
	res.status(statusCode).json({
		status: 'Success',
		data: {
			jwtToken
		}
	})
}

// User logic
exports.signUp = catchAsync(async (req, res, next) => {

	const { name, email, role, password, passwordConfirm, passChanged } = req.body
	const newUser = await User.create({ name, email, password, role, passwordConfirm, passChanged });
	const jwtToken = loginToken(newUser._id)

	res.status(200).json({
		status: 'Success',
		data: {
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
	if (!tokenHeader) return next(new AppError('You are not logged in. Please log in!', 401));
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


	// 4. Check if the user change password after the token was issued
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
			return next(new AppError("You are not allowed to delete this tour.", 403))
		};
		next();
	};
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
	// Get user
	const user = await User.findOne({ email: req.body.email })
	const response = {
		status: 'Success',
		message: "If there is an account with this email, you should have received an email to reset your pass."
	}

	//if (!user) return next(new AppError("There is not an account with this email address.", 403)) // Not good idea for security reason
	if (!user) return res.status(200).json({response})

	// Generate a temporary pass 
	const tempToken = user.generateTempToken()
	// Save it to data base encrypted
	await user.save({ validateBeforeSave: false });
	// Generate reset pass link with the token
	const link = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${tempToken}`//http://localhost:3000/api/v1/users/resetpassword/:tempToken
	const message = `Have you forgotten your password?\nUse the this link ${link} to reset it.\nIf you haven't request a reset of your password, ignore this message.`;

	const emailOptions = {
		email: user.email,
		subject: 'Reset password',
		message,
	}

	// Send forgot pass email with a reset link
	try {
		await sendEmail(emailOptions);
		res.status(200).json({response})
	
	} catch (error) {
		//this.user.passChanged = undefined; //??
		this.user.tempEncrpToken = undefined;
		this.user.tempTokenExpiration = undefined;
		await user.save({ validateBeforeSave: false })

		return next(new AppError('There was an error resetting your password. Please try again later!', 500))
	}

});

exports.resetPassword = catchAsync(async (req, res, next) => {

	// Get the user based on encrypted token
	const tempEncrpToken = crypto.createHash('sha256').update(req.params.tempToken).digest('hex');
	const user = await User.findOne({tempEncrpToken, tempTokenExpiration: {$gt: Date.now()} });

	if (!user) return next(new AppError('Your link is invalid or expired. Please request a new password again.', 400));

	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.tempEncrpToken = undefined;
	user.tempTokenExpiration = undefined;

	//passChanged is updated on pre.save

	await user.save();
	const token = loginToken(user._id)

	res.status(200).json({
		status: 'Success',
		data: {
			message: 'Your password was successfully updated.',
			token
		}
	})
});

exports.updatePassword = catchAsync(async (req, res, next) => {

	// 1. Get the user 
	const user = await User.findById({_id: req.user._id}).select('+password');

	if (!req.body.currentPassword) return next(new AppError('Please provide the current password.', 400));
	if (! req.body.password || req.body.password) return next(new AppError('Please provide new password and confirmation password.', 400));
	// 2. Check if provided pass is valid
	if (!user || !(await user.checkPass(req.body.currentPassword, user.password))) return next(new AppError('Incorrect username or password', 401));
	
	// 3. Update the old pass
	user.password = req.body.password;
	user.passwordConfirm = req.body.password;
	user.tempEncrpToken = undefined;
	user.tempTokenExpiration = undefined;

	//passChanged is updated on pre.save

	await user.save();
	// 4. Log the user in / send the JWT
	const token = loginToken(user._id)
	res.status(200).json({
		status: 'Success',
		data: {
			message: 'Your password was successfully updated.',
			token
		}
	})
})


// TODO: double check this