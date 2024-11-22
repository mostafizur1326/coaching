require('dotenv').config();
const nodemailer = require("nodemailer");
const { generateOTP } = require("../utils/otp-generator.js");

const OTP = generateOTP();

const verificationEmail = async (email) => {

  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Verification Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
      <div style="max-width: 600px; margin: 50px auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
        <h2 style="text-align: center; color: #333;">Verify Your Email</h2>
        <p style="font-size: 14px; color: #555;">
          Hello, <br><br>
          Please use the following code to verify your email address:
        </p>
        <div style="text-align: center; margin: 20px 0; padding: 10px; background-color: #f1f1f1; border: 1px dashed #ccc; border-radius: 4px;">
          <span style="font-size: 24px; font-weight: bold; color: #333;">${OTP}</span>
        </div>
        <p style="font-size: 14px; color: #555; text-align: center;">
          This code will expire in 10 minutes. If you didn’t request this, please ignore this email.
        </p>
        <p style="font-size: 12px; color: #888; text-align: center;">
          &copy; 2024 BPMHS. All rights reserved.
        </p>
      </div>
    </body>
  </html>`;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.AUTHOR_EMAIL,
      pass: process.env.AUTHOR_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.AUTHOR_EMAIL,
      to: email, 
      subject: "Your Verification Code",
      html: htmlContent,
    });

    dbgr("Email sent: %s", info.messageId);
    
  } catch (error) {
    dbgr("Error sending email:", error);
  }
};

module.exports = {
   verificationEmail,
   OTP,
};