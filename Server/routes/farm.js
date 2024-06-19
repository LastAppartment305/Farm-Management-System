import { authenticateToken,authRole } from '../auth/authorization.js';
import express from 'express';
import { addNewFarm,retrieveFarmList,deleteFarm } from '../controllers/farmController.js';

const router=express.Router();
router.post('/addfarm',authenticateToken,addNewFarm);
router.get('/getfarmlist',authenticateToken,retrieveFarmList);
router.delete('/deletefarm',authenticateToken,deleteFarm)
export default router;