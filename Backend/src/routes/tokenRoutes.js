import express from "express";
import tokenController from "../controllers/tokenController.js";

const router = express.Router();

router.post("/refresh-token", tokenController.refreshToken);

export default router;
