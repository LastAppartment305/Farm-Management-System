import express from "express";
import { authRole, authenticateToken } from "../auth/authorization.js";
import {
  checkAssign,
  sendCookie,
  createWorker,
} from "../controllers/workerController.js";

const router = express.Router();
router.post("/check-assign", checkAssign);
router.post("/send-auth", sendCookie);
router.post("/createWorker", createWorker);

export default router;
