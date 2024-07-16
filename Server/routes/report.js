import { authenticateToken, authRole } from "../auth/authorization.js"
import express from "express"
import {
  getReportPhoto,
  getDownloadAuth,
} from "../controllers/reportController.js"

const router = express.Router()

router.post("/getreportlist", authenticateToken, getReportPhoto)
router.get("/getDownloadAuth", authenticateToken, getDownloadAuth)
export default router
