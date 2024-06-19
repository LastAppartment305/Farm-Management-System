import express from 'express';
import { retrieveDataForDashboard,createWorker,deleteUser,retrieveWorkerDataForOwner, deleteWorker,editWorker,receiveUploadPhoto } from '../controllers/dashboardController.js';
import { authenticateToken,authRole } from '../auth/authorization.js';

const router=express.Router();
router.get('/',authenticateToken,authRole('admin'),retrieveDataForDashboard);
router.post('/',authenticateToken,authRole('admin'),deleteUser);
router.post('/staff',authenticateToken,createWorker);
router.get('/staff',authenticateToken,retrieveWorkerDataForOwner)
router.delete('/staff',authenticateToken,deleteWorker);
router.post('/staff/editworker',authenticateToken,editWorker);
router.post('/uploadbase64image',receiveUploadPhoto);
export default router;