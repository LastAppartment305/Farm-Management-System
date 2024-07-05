import express from "express";
import { authRole, authenticateToken } from "../auth/authorization.js";
import { checkAssign, sendCookie } from "../controllers/workerController.js";

const router = express.Router();
router.post("/check-assign", checkAssign);
router.post("/send-auth", sendCookie);

export default router;
