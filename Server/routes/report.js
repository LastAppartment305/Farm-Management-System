import { authenticateToken, authRole } from "../auth/authorization.js";
import express from "express";
import { getReportPhoto } from "../controllers/reportController.js";

const router = express.Router();

router.post("/getreportlist", authenticateToken, getReportPhoto);
export default router;
