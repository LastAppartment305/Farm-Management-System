import express from 'express';
import { retrieveDataForDashboard,createWorker,deleteUser,retrieveWorkerDataForOwner, deleteWorker } from '../controllers/dashboardController.js';
import { authenticateToken,authRole } from '../auth/authorization.js';

const router=express.Router();
router.get('/',authenticateToken,authRole('admin'),retrieveDataForDashboard);
router.post('/',authenticateToken,authRole('admin'),deleteUser);
router.post('/assign-worker',authenticateToken,createWorker);
router.get('/assign-worker',authenticateToken,retrieveWorkerDataForOwner)
router.delete('/assign-worker',authenticateToken,deleteWorker);
export default router;