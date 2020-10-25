const nodemailer = require("nodemailer");

const sendEmail = async options => {
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASS
		},
	});

	// send mail with defined transport object
	const info = {
		from: '"Fred Foo 👻" <foo@example.com>', // sender address
		to: options.email, // list of receivers
		subject: options.subject, // Subject line
		text: options.message, // plain text body
		//html: "<b>Hello world?</b>", // html body
	};

	try {
		await transporter.sendMail(info);
	} catch (error) {
		console.log(error)
	}

}

module.exports = sendEmail;