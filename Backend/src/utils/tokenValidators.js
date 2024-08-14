import { validateToken } from "./validators.js";

export const validateRefreshToken = () => {
  return validateToken("refreshToken", "body");
};

export default {
  validateRefreshToken,
};