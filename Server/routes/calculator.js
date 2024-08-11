import express from "express";
import { getOverallData } from "../controllers/calculatorController.js";
import { authenticateToken, authRole } from "../auth/authorization.js";

const router = express.Router();

router.post("/get-crop-overall-data", authenticateToken, getOverallData);

export default router;
