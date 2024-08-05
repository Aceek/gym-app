import passport from "passport";

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
      res.send('You are logged out');
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
  loginGoogle,
  googleCallback,
  logout,
  authFailure,
  protectedRoute,
  profile,
};
