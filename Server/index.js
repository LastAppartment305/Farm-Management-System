import mysql2 from 'mysql2';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();

app.use(bodyParser.json());
app.use(cors());

const connection = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'farm_management'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the Database!");
});

app.post('/', async(req, res) => {
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

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
