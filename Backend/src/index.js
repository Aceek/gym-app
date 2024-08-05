import express from "express";
import passport from "passport";
import sessionConfig from "./config/session.js";
import authRoutes from "./routes/authRoutes.js";
import testDbConnection from "./services/dbService.js";
import google_passport from "./config/google_passport.js";
import { syncDatabase } from './models/index.js';

const app = express();

app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.get("/", (req, res) => {
  res.send('<a href="auth/google">Authenticate with Google</a>');
});

app.use(authRoutes);

app.get("/test-db", testDbConnection);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  syncDatabase();
});
