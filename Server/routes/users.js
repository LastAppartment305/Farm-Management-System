import express from "express";
import {
  registerController,
  loginCheck,
  getUserInformation,
  editUserInformation,
  getPosts,
  getSpecificPost,
} from "../controllers/registerController.js";
import { authenticateToken, authRole } from "../auth/authorization.js";
//import { retrieveDataForDashboard } from '../controllers/dashboardController.js';

const router = express.Router();

router.post("/signup", registerController);
router.post("/login", loginCheck);
router.post("/getUserInfo", authenticateToken, getUserInformation);
router.post("/editUserInfo", authenticateToken, editUserInformation);
router.get("/getPosts", authenticateToken, getPosts);
router.post("/getSpecificPost", authenticateToken, getSpecificPost);
// router.get('/dashboard',retrieveDataForDashboard);

export default router;
