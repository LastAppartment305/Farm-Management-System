import express from 'express';
import { retrieveDataForDashboard,assignWorker,deleteUser } from '../controllers/dashboardController.js';
import { authenticateToken,authRole } from '../auth/authorization.js';

const router=express.Router();
router.get('/',authenticateToken,authRole('admin'),retrieveDataForDashboard);
router.post('/',authenticateToken,authRole('admin'),deleteUser);
router.post('/assign-worker',assignWorker);
export default router;