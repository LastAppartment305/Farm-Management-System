import express from "express";
import {
  registerController,
  loginCheck,
  getUserInformation,
  editUserInformation,
  getPosts,
  getSpecificPost,
  getAllPost,
  approvePost,
  unapprovePost,
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
router.get("/getAllPost", authenticateToken, authRole("admin"), getAllPost);
router.post(
  "/approvePropose",
  authenticateToken,
  authRole("admin"),
  approvePost
);
router.post(
  "/cancelApprove",
  authenticateToken,
  authRole("admin"),
  unapprovePost
);
// router.get('/dashboard',retrieveDataForDashboard);

export default router;
