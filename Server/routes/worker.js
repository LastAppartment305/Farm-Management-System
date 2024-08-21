import express from "express";
import {
  authRole,
  authenticateToken,
  workerAuthToken,
} from "../auth/authorization.js";
import {
  sendWorkerToken,
  sendCookie,
  createWorker,
  workerLogout,
  getPostsForWorker,
  getSpecificPost,
  agreePropose,
  getAgreedPostsForWorker,
  makeContractForm,
} from "../controllers/workerController.js";

const router = express.Router();
router.post("/send-token", sendWorkerToken);
router.post("/send-auth", sendCookie);
router.post("/createWorker", createWorker);
router.get("/worker-logout", workerLogout);
router.get("/get-approve-post-for-worker", workerAuthToken, getPostsForWorker);
router.post("/getSpecificPostForWorker", workerAuthToken, getSpecificPost);
router.post("/agreePropose", workerAuthToken, agreePropose);
router.get("/getAgreedPosts", workerAuthToken, getAgreedPostsForWorker);
router.post("/makeContract", workerAuthToken, makeContractForm);

export default router;
