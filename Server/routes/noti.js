import express from "express";
import { authenticateToken } from "../auth/authorization.js";
import {
  getNotification,
  sendOTPMessage,
} from "../controllers/notiController.js";
const router = express.Router();

router.post("/sendOTP", sendOTPMessage);
router.get("/getAllNotification", authenticateToken, getNotification);

export default router;
