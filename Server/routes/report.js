import { authenticateToken, authRole } from "../auth/authorization.js";
import express from "express";
import {
  getReportPhoto,
  getDownloadAuth,
  fetchB2Cloud,
  ApprovedImageList,
} from "../controllers/reportController.js";

const router = express.Router();

router.post("/getreportlist", authenticateToken, getReportPhoto);
router.get("/getDownloadAuth", authenticateToken, getDownloadAuth);
router.post("/fetchb2", authenticateToken, fetchB2Cloud);
router.post("/getApproveImageList", authenticateToken, ApprovedImageList);
export default router;
