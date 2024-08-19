import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
};

export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

// export const generateConfirmationToken = (userId) => {
//   return jwt.sign({ id: userId }, process.env.EMAIL_CONFIRMATION_SECRET, {
//     expiresIn: "1h",
//   });
// };

const generateConfirmationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Génère un code à 6 chiffres
};

export const generateResetToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.RESET_PASSWORD_SECRET, {
    expiresIn: "1h",
  });
};

export const generateTokensForUser = (user) => {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  return { accessToken, refreshToken };
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  // generateConfirmationToken,
  generateConfirmationCode,
  generateResetToken,
  generateTokensForUser,
};
