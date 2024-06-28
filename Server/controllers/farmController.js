import { connection } from '../index.js';
import asyncHandler from 'express-async-handler';

export const addNewFarm=asyncHandler(async(req,res)=>{
    const {crop_type,location,field_name}=req.body;
    const isoDate = new Date();
  const mySQLDateString = isoDate.toJSON().slice(0, 19).replace('T', ' ');

  const insertToFarm='insert into farm(Crop_type,Location,UserId,Name,created_at) values(?,?,?,?,?)';
  const insertToFarmValues=[crop_type,location,req.user.id,field_name,mySQLDateString];

  connection.query(insertToFarm,insertToFarmValues,(err,result)=>{
    if(err){
        console.error("Error inserting data" , err);
        res.status(500).json({error:"An error occurred while inserting data"});

      }else{
        console.log("inserted successfully");
        res.json({message:"Data inserted successfully"});
      }
  })
})
//-------------------------------------------------------------
export const retrieveFarmList=asyncHandler(async(req,res)=>{
  const getFarmList='select * from farm where UserId=?';

  const value=[req.user.id]

  const queryDatabase=(sql,value)=>{
    return new Promise((resolve,reject)=>{
      connection.query(sql,value,(error,result)=>{
        if(error) return reject(error);
        resolve(result);
      })
    })
  }

  Promise.all([queryDatabase(getFarmList,value)])
  .then(([result])=>{
    res.json(result);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('An error occurred');
  });
})
//-------------------------------------------
export const deleteFarm=asyncHandler(async(req,res)=>{
  console.log("User Id to delete",req.body)
  const {id}=req.body;
  console.log("Farm Id: ",id)
  const sql='delete from farm where FarmId = ?';
  const values=[id];

  connection.query(sql,values,(err,result)=>{
    if(err){
      console.error("Error deleting data" , err);
      res.status(500).json({error:"An error occurred while deleting data"});

    }else{
      console.log("deleted successfully");
      res.json({message:"Data deleted successfully"});
    }
  })
})