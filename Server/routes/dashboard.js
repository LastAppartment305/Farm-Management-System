import express from 'express';
import { retrieveDataForDashboard,assignWorker } from '../controllers/dashboardController.js';

const router=express.Router();
router.get('/',retrieveDataForDashboard);
router.post('/assign-worker',assignWorker);
export default router;