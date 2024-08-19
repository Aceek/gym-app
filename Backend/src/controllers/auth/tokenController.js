import tokenService from "../../services/tokenService.js";
import {
  sendErrorResponse,
  sendSuccessResponse,
} from "../../utils/responseHandler.js";

export const refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return sendErrorResponse(res, "Refresh token is required", 400);
  }

  try {
    const user = tokenService.verifyToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const newAccessToken = tokenService.generateAccessToken(user);
    return sendSuccessResponse(
      res,
      { accessToken: newAccessToken },
      "Token refreshed successfully",
      200
    );
  } catch (error) {
    return sendErrorResponse(res, "Invalid refresh token", 401);
  }
};

export default {
  refreshToken,
};
