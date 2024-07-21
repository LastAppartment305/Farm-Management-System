import express from "express";
import { sendOTPMessage } from "../controllers/otpController.js";
const router = express.Router();

router.post("/sendOTP", sendOTPMessage);

export default router;
