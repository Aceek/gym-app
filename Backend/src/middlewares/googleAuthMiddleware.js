import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuthMiddleware = async (req, res, next) => {
  const token = req.body.token;
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    req.googleUser = {
      id: payload.sub,
      email: payload.email,
      displayName: payload.name,
      photo: payload.picture,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Google token" });
  }
};

export default googleAuthMiddleware;
