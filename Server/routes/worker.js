import express from 'express';
import { authRole,authenticateToken } from '../auth/authorization.js';
import { sendOTP_To_worker } from '../controllers/workerController.js';

const router=express.Router();
router.post('/send-otp',sendOTP_To_worker);

export default router;