import tokenService from "../../services/tokenService.js";
import { isTokenBlacklisted } from "../../services/tokenBlacklistService.js";

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const isBlacklisted = await isTokenBlacklisted(refreshToken);
    if (isBlacklisted) {
      return res
        .status(401)
        .json({ message: "Refresh token has been revoked" });
    }

    const user = tokenService.verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const newAccessToken = tokenService.generateAccessToken(user);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};

export default {
  refreshToken,
};
