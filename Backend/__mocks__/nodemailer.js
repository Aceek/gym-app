const nodemailer = {
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue(true), // Simule un envoi d'e-mail réussi
  }),
};

export default nodemailer;
