import mysql2 from 'mysql2';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import test from './routes/test.js';
import registerUser from './routes/users.js';
import dashbordDetail from './routes/dashboard.js';
import cookieParser from 'cookie-parser';


const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use('/',test);
app.use(cookieParser())


export const connection = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'farm_management'
});

console.log(connection.config.user);

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the Database!");
 
});

app.use('/',registerUser);
app.use('/dashboard',dashbordDetail);
app.use('/logout',(req,res)=>{
  console.log("This is from index.js: logout work");
  res.clearCookie('authToken')
  res.send(true);
})

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
