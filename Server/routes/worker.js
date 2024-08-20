import express from "express";
import {
  authRole,
  authenticateToken,
  workerAuthToken,
} from "../auth/authorization.js";
import {
  checkAssign,
  sendCookie,
  createWorker,
  workerLogout,
  getPostsForWorker,
  getSpecificPost,
} from "../controllers/workerController.js";

const router = express.Router();
router.post("/check-assign", checkAssign);
router.post("/send-auth", sendCookie);
router.post("/createWorker", createWorker);
router.get("/worker-logout", workerLogout);
router.get("/get-approve-post-for-worker", getPostsForWorker);
router.post("/getSpecificPostForWorker", getSpecificPost);

export default router;
