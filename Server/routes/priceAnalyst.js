import express from "express";
import {
  registerAnalyst,
  sendToken,
} from "../controllers/priceAnalystController.js";
import {} from "../auth/authorization.js";

const router = express.Router();

router.post("/register", registerAnalyst);
router.post("/login", sendToken);
export default router;
