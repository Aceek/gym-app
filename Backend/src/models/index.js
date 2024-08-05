import sequelize from "../config/sequelize.js";
import User from "./user.js";

const syncDatabase = async () => {
  try {
    await sequelize.sync();
    console.log("Database synchronized");
  } catch (err) {
    console.error("Unable to sync database:", err);
  }
};

export { User, syncDatabase };
