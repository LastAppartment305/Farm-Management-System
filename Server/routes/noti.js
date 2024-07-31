import express from "express";
import { authenticateToken } from "../auth/authorization.js";
import {
  getNotification,
  sendOTPMessage,
  NotiStatus,
} from "../controllers/notiController.js";
const router = express.Router();

router.post("/sendOTP", sendOTPMessage);
router.get("/getAllNotification", authenticateToken, getNotification);
router.get("/changeNotiStatus", authenticateToken, NotiStatus);

export default router;
