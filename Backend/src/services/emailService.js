import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: `email-smtp.${process.env.SES_SMTP_REGION}.amazonaws.com`,
  port: 465,
  auth: {
    user: process.env.SES_SMTP_USER,
    pass: process.env.SES_SMTP_PASSWORD,
  },
});

export const sendConfirmationEmail = async (email, token) => {
  const confirmationLink = `${process.env.FRONTEND_URL}/confirm-email?token=${token}`;
  const mailOptions = {
    from: process.env.SES_SMTP_VERIFIED_MAIL,
    to: email,
    subject: "Confirm your email",
    html: `<p>Please confirm your email by clicking the following link: <a href="${confirmationLink}">Confirm Email</a></p>`,
  };
  await transporter.sendMail(mailOptions);
};

export const sendResetPasswordEmail = async (email, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const mailOptions = {
    from: process.env.SES_SMTP_VERIFIED_MAIL,
    to: email,
    subject: "Reset your password",
    html: `<p>Click the following link to reset your password: <a href="${resetLink}">Reset Password</a></p>`,
  };
  await transporter.sendMail(mailOptions);
};

export default {
  sendConfirmationEmail,
  sendResetPasswordEmail,
};
