import express from "express";
import {
  retrieveDataForDashboard,
  createWorker,
  deleteAssignWorkerFromFarm,
  assignWorkerToFarm,
  deleteUser,
  retrieveWorkerDataForOwner,
  deleteWorker,
  editWorker,
  receiveUploadPhoto,
  retrieveWorkerInfo,
  postListsForAdmin,
  confirmToImages,
} from "../controllers/dashboardController.js";
import {
  authenticateToken,
  authRole,
  workerAuthToken,
} from "../auth/authorization.js";

const router = express.Router();
router.get("/", authenticateToken, authRole("admin"), retrieveDataForDashboard);
router.post("/", authenticateToken, authRole("admin"), deleteUser);
router.post("/staff", authenticateToken, createWorker);
router.get("/staff", authenticateToken, retrieveWorkerDataForOwner);
router.delete("/staff", authenticateToken, deleteWorker);
router.post("/staff/editworker", authenticateToken, editWorker);
router.post("/staff/assign-worker", authenticateToken, assignWorkerToFarm);
router.delete(
  "/staff/assign-worker",
  authenticateToken,
  deleteAssignWorkerFromFarm
);
router.post("/uploadbase64image", workerAuthToken, receiveUploadPhoto);
router.get("/getWorkerInfo", workerAuthToken, retrieveWorkerInfo);
router.get(
  "/getPostListsToApprove",
  authenticateToken,
  authRole("admin"),
  postListsForAdmin
);
router.post(
  "/confirmReportImages",
  authenticateToken,
  authRole("admin"),
  confirmToImages
);

export default router;
