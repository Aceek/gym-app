import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: `email-smtp.${process.env.AWS_REGION}.amazonaws.com`,
  port: 465,
  secure: true,
  auth: {
    user: process.env.SES_SMTP_USER,
    pass: process.env.SES_SMTP_PASSWORD,
  },
});

const mailOptions = {
  from: "linhardtilan@gmail.com",
  to: "linhardtilan@gmail.com",
  subject: "Test Email via SMTP",
  text: "Ceci est un email de test envoyé via Amazon SES en utilisant SMTP.",
};

const sendEmail = async () => {
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email envoyé : %s", info.messageId);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
  }
};

sendEmail();
