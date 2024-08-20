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

export const sendConfirmationEmailToUser = async (email, confirmationCode) => {
  const mailOptions = {
    from: process.env.SES_SMTP_VERIFIED_MAIL,
    to: email,
    subject: "Confirm your email",
    html: `<p>Veuillez confirmer votre email en entrant ce code dans l'application: <strong>${confirmationCode}</strong></p>`,
  };
  await transporter.sendMail(mailOptions);
};

export const sendResetPasswordEmail = async (email, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const mailOptions = {
    from: process.env.SES_SMTP_VERIFIED_MAIL,
    to: email,
    subject: "Reset your password",
    html: `<p>Click the following link to reset your password: <a href="${resetLink}">Reset Password</a>
     your token is ${token}</p>`,
  };
  await transporter.sendMail(mailOptions);
};

export default {
  sendResetPasswordEmail,
  sendConfirmationEmailToUser,
};
