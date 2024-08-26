import express from "express";
import {
  registerAnalyst,
  sendToken,
  retrieveRainfedPaddyInfo,
  updateChemicalPrice,
  updateLaborWage,
  updateMachineryCost,
} from "../controllers/priceAnalystController.js";
import { analystAuth } from "../auth/authorization.js";

const router = express.Router();

router.post("/register", registerAnalyst);
router.post("/login", sendToken);
router.get("/getRainfedPaddyInfo", analystAuth, retrieveRainfedPaddyInfo);
router.post("/updateChemicalPrice", analystAuth, updateChemicalPrice);
router.post("/updateLaborWage", analystAuth, updateLaborWage);
router.post("/updateMachineryCost", analystAuth, updateMachineryCost);
export default router;
