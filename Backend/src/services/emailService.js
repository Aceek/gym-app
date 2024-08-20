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

export const sendResetPasswordEmail = async (email, code) => {
  const mailOptions = {
    from: process.env.SES_SMTP_VERIFIED_MAIL,
    to: email,
    subject: "Reset your password",
    html: `<p>Utilisez ce code pour réinitialiser votre mot de passe : <strong>${code}</strong></p>`,
  };
  await transporter.sendMail(mailOptions);
};

export default {
  sendResetPasswordEmail,
  sendConfirmationEmailToUser,
};
