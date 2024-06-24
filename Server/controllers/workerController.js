import { connection } from '../index.js';
import asyncHandler from 'express-async-handler';
//import { auth } from '../../client/firebase.config.js';
//import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";


export const sendOTP_To_worker=asyncHandler(async(req,res)=>{
    
    console.log(req.body);
})