import { OAuth2Client } from "google-auth-library";
import { sendErrorResponse } from "../../utils/responseHandler.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuthMiddleware = async (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    return sendErrorResponse(res, "Token is required", 400);
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    req.user = {
      googleId: payload.sub,
      email: payload.email,
      displayName: payload.name,
      photo: payload.picture,
    };
    next();
  } catch (error) {
    console.error("Error verifying Google token:", error.message);
    return sendErrorResponse(res, "Invalid Google token", 401);
  }
};

export default googleAuthMiddleware;
