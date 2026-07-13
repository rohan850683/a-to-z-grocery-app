const nodemailer = require("nodemailer");

const emailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 30000,
});

module.exports = emailTransporter;