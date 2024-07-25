import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { connection } from "../index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//put new user information into database
export const registerController = asyncHandler(async (req, res) => {
  const { name, phone, password, userRole } = req.body;

  const isoDate = new Date();
  const mySQLDateString = isoDate.toJSON().slice(0, 19).replace("T", " ");

  //hashing with bcrypt
  const storePassword = async (plainPassword) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  };

  const encodedPassword = await storePassword(password);
  const sql =
    "INSERT INTO user (Name, Phone_no, User_role, Created_at, Password) VALUES (?,?,?,?,?)";

  const values = [name, phone, userRole, mySQLDateString, encodedPassword];

  connection.query(sql, values, function (err, result) {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).json({ error: "An error occurred while inserting data" });
    } else {
      console.log("Data inserted successfully!");
      res.json({ message: "Data inserted successfully" });
    }
  });
});

//retrieve data and compare necessary checks at login
export const loginCheck = asyncHandler(async (req, res) => {
  const { password, name } = req.body;
  //console.log(receiveData);
  const sql = "select Password,User_role,UserId from user where Name=?";
  const values = [name];
  connection.query(sql, values, function (err, result) {
    if (err) {
      console.error("Error retrieving data:", err);
    } else {
      if (result[0] != null) {
        const storedHash = result[0].Password;
        const role = result[0].User_role;
        const id = result[0].UserId;

        bcrypt.compare(password, storedHash, (err, result) => {
          if (err) throw err;
          if (result) {
            //res.send(role)

            console.log(
              "Message from registerController : password is correct"
            );
            const token = jwt.sign(
              { username: name, role: role, id: id },
              process.env.ACCESS_TOKEN_SECRET
            );
            //set cookie in client machine
            res.cookie("authToken", token, {
              httpOnly: true,
              sameSite: "strict",
            });
            res.send(role);
          } else {
            res.send("");
            console.log("incorrect password");
          }
        });
      } else {
        res.send("");
        console.log("user does not exist");
      }
    }
  });
});
