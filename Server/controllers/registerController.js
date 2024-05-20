import asyncHandler from 'express-async-handler';
import bcrypt from 'bcrypt';
import { connection } from '../index.js';

export const registerController=asyncHandler(async(req,res)=>{
    const { name, phone, password, userRole } = req.body;
  
  const isoDate = new Date();
  const mySQLDateString = isoDate.toJSON().slice(0, 19).replace('T', ' ');

  //const values = [name, phone, userRole, mySQLDateString, password];
  
  const storePassword=async (plainPassword)=>{
    const saltRounds=10;
    const hashedPassword=await bcrypt.hash(plainPassword,saltRounds);
    return hashedPassword;
  }

   const encodedPassword=await storePassword(password);
   //const sql = `INSERT INTO user (Name, Phone_no, User_role, Created_at, Password) VALUES ("${name}","${phone}","${userRole}","${mySQLDateString}","${encodedPassword}")`;
   const sql = 'INSERT INTO user (Name, Phone_no, User_role, Created_at, Password) VALUES (?,?,?,?,?)';

  const values=[name,phone,userRole,mySQLDateString,encodedPassword];

  connection.query(sql,values, function(err, result) {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).json({ error: "An error occurred while inserting data" });
    } else {
      console.log("Data inserted successfully!");
      res.json({ message: "Data inserted successfully" });
    }
  });
});
