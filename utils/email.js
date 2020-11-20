const nodemailer = require('nodemailer');

// new Email(user, url).sendWelcome(); // user: {email, name}, url {}

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Ionela Cristea <${process.env.EMAIL_FROM}>`;
  }

  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      return 1; // TODO
    } else if (process.env.NODE_ENV === 'development') {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASS,
        },
      });
    }
  }

  async send(options) {
    const mailOptions = {
      from: this.from, //'"Fred Foo 👻" <foo@example.com>', // sender address
      to: this.email, // list of receivers
      subject: options.subject, // Subject line
      text: options.message, // plain text body
      //html: "<b>Hello world?</b>", // html body
    };

    try {
      await this.createTransport.sendMail(mailOptions);
    } catch (e) {
      console.error(e);
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Tour-Guide Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'Password reset',
      'Your password reset token is valid for only 10 minutes.'
    );
  }
};
