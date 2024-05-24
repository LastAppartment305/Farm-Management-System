import express from 'express';
import { retrieveDataForDashboard } from '../controllers/dashboardController.js';

const router=express.Router();
router.get('/',retrieveDataForDashboard);
export default router;