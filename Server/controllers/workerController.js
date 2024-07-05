import { connection } from "../index.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
//import { auth } from '../../client/firebase.config.js';
//import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
dotenv.config();

export const checkAssign = asyncHandler(async (req, res) => {
  const { ownerPhone, workerPhone } = req.body;
  console.log(req.body);
  const getFarmId =
    "select FarmId,WorkerId,UserId from worker_detail where UserId in (select UserId from user where Phone_no=?) and WorkerId in (select WorkerId from worker where Phone_no=?)";

  const value = [ownerPhone, workerPhone];

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  Promise.resolve(queryDatabase(getFarmId, value))
    .then((result) => {
      if (result[0].FarmId && result[0].WorkerId) {
        res.json({
          farmid: result[0].FarmId,
          workerid: result[0].WorkerId,
          userid: result[0].UserId,
        });
        console.log(result);
      } else {
        res.json({ id: null });
      }
      // try {
      //   res.json({ farmid: result[0].FarmId, workerid: result[0].WorkerId });
      //   console.log(result);
      // } catch (err) {
      //   console.log(err);
      // }
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send({ message: "unexpected error occur at logging in with otp" });
    });
});
//-------------------------------------------------------------
export const sendCookie = asyncHandler(async (req, res) => {
  const { farmid, workerid, userid } = req.body;

  try {
    const token = jwt.sign(
      { farmid: farmid, workerid: workerid, userid: userid },
      process.env.WORKER_TOKEN_SECRET
    );

    res.cookie("workerAuth", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });
    res.status(200).send({ message: "Cookie set successfully" });
    // console.log(token);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "error at sending token" });
  }
});
