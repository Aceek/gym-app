import passport from "passport";
import { findOrCreateUser } from "../services/userService.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const verifyGoogleToken = async (token) => {
  console.log(
    "Verifying token with GOOGLE_CLIENT_ID:",
    process.env.GOOGLE_CLIENT_ID
  );
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
};

const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    console.log("Token:", token);
    const payload = await verifyGoogleToken(token);

    // Utiliser le service pour trouver ou créer un utilisateur
    const user = await findOrCreateUser({
      id: payload.sub,
      emails: [{ value: payload.email }],
      displayName: payload.name,
      photos: [{ value: payload.picture }],
    });

    res.status(200).json({ user });
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
};

const loginGoogle = passport.authenticate("google", {
  scope: ["email", "profile"],
});

const googleCallback = passport.authenticate("google", {
  successRedirect: "/protected",
  failureRedirect: "/auth/failure",
});

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.send("You are logged out");
    });
  });
};

const authFailure = (req, res) => {
  res.send("Failed to authenticate..");
};

const protectedRoute = (req, res) => {
  res.send(`Hello ${req.user.displayName}`);
};

const profile = (req, res) => {
  res.send(req.user);
};

export {
  googleAuth,
  loginGoogle,
  googleCallback,
  logout,
  authFailure,
  protectedRoute,
  profile,
};
