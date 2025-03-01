import express from "express";
import {
  getOverallData,
  storePostData,
} from "../controllers/calculatorController.js";
import { authenticateToken, authRole } from "../auth/authorization.js";

const router = express.Router();

router.post("/get-crop-overall-data", authenticateToken, getOverallData);
router.post("/store-post", authenticateToken, storePostData);

export default router;
