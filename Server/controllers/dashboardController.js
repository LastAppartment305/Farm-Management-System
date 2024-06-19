import { connection } from '../index.js';
import asyncHandler from 'express-async-handler';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

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
//-------------------------------------------------------------------------------
  export const retrieveWorkerDataForOwner=asyncHandler(async(req,res)=>{
    const tableData={
      worker:""
    }
    const sqlWorker="select * from worker where WorkerId in (select WorkerId from worker_detail where UserId=?)";
    const UserId=req.user.id;
    const queryDatabase=(sql,value)=>{
      return new Promise((resolve,reject)=>{
        connection.query(sql,value,(err,result)=>{
          if(err) return reject(err);
          resolve (result);
        })
      })
    }
    Promise.all([queryDatabase(sqlWorker,UserId)])
    .then(([workerResult])=>{
      //console.log(workerResult)
      tableData.worker = workerResult;
    res.json(tableData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('An error occurred');
    });
  })
//---------------------------------------------------------------------
  export const createWorker=asyncHandler(async(req,res)=>{
    const detail={
      worker:"",
      worker_detail:"",
    }
    const isoDate = new Date();
  const mySQLDateString = isoDate.toJSON().slice(0, 19).replace('T', ' ');
  const {name,gender,phone,address,age}=req.body;
  const UserId=req.user.id;
  console.log('Owner id',UserId)

  const retrieveId='select WorkerId from worker where Phone_no = ?';
  const insertToWorker='insert into worker(Name,Gender,Phone_no,Address,Age,Created_at) values(?,?,?,?,?,?)';
  const insertToWorker_Detail='insert into worker_detail(UserId,WorkerId) values(?,?)';
  const valueForWorker=[name,gender,phone,address,age,mySQLDateString];
  
  const phoneNo=[phone];

  //function to query database
  const queryDatabase=(sql,value)=>{
    return new Promise((resolve,reject)=>{
      connection.query(sql,value,(error,result)=>{
        if(error) return reject(error);
        resolve(result);
      })
    })
  }

  const resolvePromise=Promise.resolve(queryDatabase(insertToWorker,valueForWorker))
  resolvePromise.then(async(value)=>{
    console.log("Id of worker : ",value.insertId)
    const vlaueForWorker_Detail=[UserId,value.insertId];
    const queryResult=await queryDatabase(insertToWorker_Detail,vlaueForWorker_Detail)
    if(queryResult){
      console.log(" success.")
      res.json({message:"Data inserted successfully"});
    }
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('An error occurred');
  });
  })
//--------------------------------------------------------------------
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
//-----------------------------------------------------------------
  export const deleteWorker=asyncHandler(async(req,res)=>{
    //console.log("Worker Id to delete",req.body)
    const {id}=req.body; 
    const sql='delete from worker where WorkerId = ?';
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

  //---------------------------------------------------------------
  export const editWorker=asyncHandler(async(res,req)=>{
    console.log(req.body);
  })
  //------------------------------------------------------------
  export const receiveUploadPhoto=asyncHandler(async(req,res)=>{
    const __filename = fileURLToPath(import.meta.url);
    const __dirname=path.dirname(__filename);
    const {url}=req.body;

    //console.log(url);


    const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
    //generate file name
    const generateUniqueFilename = (extension) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `image-${uniqueSuffix}.${extension}`;
    };


    const matches = url.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return res.status(400).json({ message: 'Invalid base64 string' });
  }

  const buffer = Buffer.from(matches[2], 'base64');

  console.log(`Buffer size: ${buffer.length}`);
  const extension = matches[1];
  const filename = generateUniqueFilename(extension);

  const filePath = path.join(uploadDir, filename);

  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      return res.status(500).json({ message: 'File upload failed', error: err.message });
    }
    res.status(200).json({ message: 'Upload successful', file: `uploads/${filename}` });
  });
});

  