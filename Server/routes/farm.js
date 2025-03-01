import { authenticateToken, authRole } from "../auth/authorization.js";
import express from "express";
import {
  addNewFarm,
  retrieveFarmList,
  deleteFarm,
  editFarmDetails,
} from "../controllers/farmController.js";

const router = express.Router();
router.post("/addfarm", authenticateToken, addNewFarm);
router.get("/getfarmlist", authenticateToken, retrieveFarmList);
router.post("/editFarm", authenticateToken, editFarmDetails);
router.delete("/deletefarm", authenticateToken, deleteFarm);
export default router;
