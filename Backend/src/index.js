import express from "express";
import passport from "passport";
import sessionConfig from "./config/session.js";
import authRoutes from "./routes/authRoutes.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import testDbConnection from "./services/dbService.js";
import sequelize from "./config/sequelize.js";

const app = express();

app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/token", tokenRoutes);
app.get("/test-db", testDbConnection);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
