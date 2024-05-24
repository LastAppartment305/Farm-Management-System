import mysql2 from 'mysql2';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import test from './routes/test.js';
import registerUser from './routes/users.js';
import dashbordDetail from './routes/dashboard.js';

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/',test);

export const connection = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'farm_management'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the Database!");
});

app.use('/',registerUser);
app.use('/dashboard',dashbordDetail);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server is running at port ${PORT}`));
