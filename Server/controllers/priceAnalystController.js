import asyncHandler from "express-async-handler";
import { connection } from "../index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const registerAnalyst = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, phone, password, NRC, address, age } = req.body.data;

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const storePassword = async (plainPassword) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  };
  const encodedPassword = await storePassword(password);
  const checkPhoneNo =
    "select Phone_no,NRC from price_analyst where Phone_no=?";
  const checkName = "select Name from price_analyst where Name=?";
  const checkNRC = "select NRC from price_analyst where NRC=?";
  const sql = `insert into price_analyst(Name,NRC,Password,Phone_no,Age,Address) values(?,?,?,?,?,?)`;
  Promise.resolve(queryDatabase(checkName, [name])).then((result) => {
    // console.log(result);
    if (!result[0]) {
      return queryDatabase(checkPhoneNo, [phone]).then((phoneResult) => {
        if (!phoneResult[0]) {
          return queryDatabase(checkNRC, [NRC]).then((NRCResult) => {
            if (!NRCResult[0]) {
              connection.query(
                sql,
                [name, NRC, encodedPassword, phone, age, address],
                function (err, result) {
                  if (err) {
                    console.error("Error inserting data:", err);
                    res.status(500).json({
                      error: "An error occurred while inserting data",
                    });
                  } else {
                    console.log("Data inserted successfully!");
                    res.json({ status: true });
                  }
                }
              );
            } else {
              res.json({ message: "အခြားမှတ်ပုံတင်ရွေးချယ်ပါ" });
            }
          });
        } else {
          res.json({ message: "အခြားဖုန်းနံပါတ်ရွေးချယ်ပါ" });
        }
      });
    } else {
      res.json({ message: "အခြားနာမည်တစ်ခုရွေးချယ်ပါ" });
    }
  });
});
//------------------------------------------------
export const sendToken = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { name, password } = req.body.data;
  const sql =
    "select Password,Role,AnalystId,Name from price_analyst where Name=?";
  const values = [name];
  connection.query(sql, values, function (err, result) {
    if (err) {
      console.error("Error retrieving data:", err);
    } else {
      if (result[0] != null) {
        // console.log("result", result);
        const storedHash = result[0].Password;
        const role = result[0].Role;
        const id = result[0].AnalystId;

        bcrypt.compare(password, storedHash, (err, result) => {
          if (result) {
            //res.send(role)

            console.log(
              "Message from registerController : password is correct"
            );
            const token = jwt.sign(
              { AnalystName: name, id: id, role: role },
              process.env.ACCESS_TOKEN_SECRET
            );
            //set cookie in client machine
            res.cookie("analystToken", token, {
              httpOnly: true,
              sameSite: "strict",
            });
            res.json({ role: role });
          } else {
            res.json({ message: "မှားယွင်းနေပါသည်" });
            console.log("incorrect password");
          }
        });
      } else {
        res.json({ message: "အကောင့်မရှိပါ" });
        console.log("user does not exist");
      }
    }
  });
});
