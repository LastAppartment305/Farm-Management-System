import express from "express";
import {
  registerAnalyst,
  sendToken,
  retrieveRainfedPaddyInfo,
  updateChemicalPrice,
  updateLaborWage,
  updateMachineryCost,
  retrieveIrrigatedPaddyInfo,
} from "../controllers/priceAnalystController.js";
import { analystAuth } from "../auth/authorization.js";

const router = express.Router();

router.post("/register", registerAnalyst);
router.post("/login", sendToken);
router.post("/getRainfedPaddyInfo", analystAuth, retrieveRainfedPaddyInfo);
router.post("/updateChemicalPrice", analystAuth, updateChemicalPrice);
router.post("/updateLaborWage", analystAuth, updateLaborWage);
router.post("/updateMachineryCost", analystAuth, updateMachineryCost);
router.get("/getIrrigatedPaddyInfo", analystAuth, retrieveIrrigatedPaddyInfo);
export default router;
