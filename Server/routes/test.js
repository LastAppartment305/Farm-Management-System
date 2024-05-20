import express from 'express';
const router=express.Router();
import {testRoute} from '../controllers/test.controller.js';


router.get("/testing",testRoute);

export default router;