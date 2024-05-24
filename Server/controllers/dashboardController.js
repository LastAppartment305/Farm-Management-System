import { connection } from '../index.js';
import asyncHandler from 'express-async-handler';

//retrieve data for dashboard
export const retrieveDataForDashboard=asyncHandler(async(req,res)=>{
    const tableData={
      user:"",
      worker:"",
    }
    const sqlUser="select * from user";
    const sqlWorker="select * from worker";
    connection.query(sqlUser,(err,result)=>{
      if(err) throw err;
      if(result){
        return res.json(result);
      }
    })

    
  })