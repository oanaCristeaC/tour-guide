const nodemailer = require('nodemailer');

// new Email(user, url).sendWelcome(); // user: {email, name}, url {}

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Ionela Cristea <${process.env.EMAIL_FROM}>`;
  }

  getTransport() {
    if (process.env.NODE_ENV === 'production') {
      return 1; // TODO
    } else {
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
      to: this.to, // list of receivers
      subject: options.subject, // Subject line
      //text: options.message, // plain text body
      html: `<b>${options.message}</b>`, // html body
    };

    try {
      await this.getTransport().sendMail(mailOptions);
    } catch (e) {
      console.error(e);
    }
  }

  async sendWelcome() {
    await this.send({
      subject: `Welcome`,
      message: `Welcome to the Tour-Guide Family, ${this.firstName}! <a href="${this.url}">Login here.</a>`,
    });
  }

  async sendPasswordReset() {
    await this.send({
      subject: 'Password reset',
      message: `Have you forgotten your password?\n 
			Reset your password using <a href="${this.url}">this link </a>\n
			Please note that your password reset token is valid for only 10 minutes.`,
    });
  }
};
