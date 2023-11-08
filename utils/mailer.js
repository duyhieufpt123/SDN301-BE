const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const Account = require('../models/Account');

dotenv.config();

const sendEmail = async (accountId, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const account = await Account.findById(accountId);

    if (!account) {
      throw new Error('Account not found');
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: account.email,
      subject: subject,
      text: text,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
