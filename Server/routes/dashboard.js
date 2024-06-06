import express from 'express';
import { retrieveDataForDashboard,createWorker,deleteUser,retrieveWorkerDataForOwner, deleteWorker } from '../controllers/dashboardController.js';
import { authenticateToken,authRole } from '../auth/authorization.js';

const router=express.Router();
router.get('/',authenticateToken,authRole('admin'),retrieveDataForDashboard);
router.post('/',authenticateToken,authRole('admin'),deleteUser);
router.post('/staff',authenticateToken,createWorker);
router.get('/staff',authenticateToken,retrieveWorkerDataForOwner)
router.delete('/staff',authenticateToken,deleteWorker);
export default router;