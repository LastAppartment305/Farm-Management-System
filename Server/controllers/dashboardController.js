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

    const queryDatabase=(sql)=>{
      return new Promise((resolve,reject)=>{
        connection.query(sql,(err,result)=>{
          if(err) return reject(err);
          resolve (result);
        })
      })
    }

    Promise.all([queryDatabase(sqlUser),queryDatabase(sqlWorker)])
    .then(([userResult,workerResult])=>{
      tableData.user=userResult;
      tableData.worker = workerResult;
    res.json(tableData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('An error occurred');
    });
  })

  export const assignWorker=asyncHandler(async(req,res)=>{
    const isoDate = new Date();
  const mySQLDateString = isoDate.toJSON().slice(0, 19).replace('T', ' ');
  const {name,gender,phone,address,age}=req.body;

  const sql='insert into worker(Name,Gender,Phone_no,Address,Age,Created_at) values(?,?,?,?,?,?)';
  const values=[name,gender,phone,address,age,mySQLDateString];
    
  connection.query(sql,values, function(err, result) {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).json({ error: "An error occurred while inserting data" });
    } else {
      console.log("Data inserted successfully!");
      res.json({ message: "Data inserted successfully" });
    }
  });
  })

  export const deleteUser=asyncHandler(async(req,res)=>{
    console.log("User Id to delete",req.body)
    const {id}=req.body;
    const sql='delete from user where UserId = ?';
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