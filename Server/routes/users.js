import express from 'express';
import { registerController,loginCheck } from '../controllers/registerController.js';
//import { retrieveDataForDashboard } from '../controllers/dashboardController.js';

const router=express.Router();

router.post('/signup',registerController);
router.post('/login',loginCheck);
// router.get('/dashboard',retrieveDataForDashboard);

export default router;