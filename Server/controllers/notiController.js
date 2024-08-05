import twilio from "twilio";
import express from "express";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import { connection } from "../index.js";
import { io } from "../index.js";

dotenv.config();
export const sendOTPMessage = asyncHandler(async (req, res) => {
  const accountSid = process.env.TWILLO_ACC_SID;
  const authToken = process.env.TWILLO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  // const { phoneNumber } = req.body;
  // console.log(phoneNumber);
  try {
    // Fetch phone number details using the lookups API
    const phoneDetails = await client.lookups.v1
      .phoneNumbers("+959680785621")
      .fetch({ type: ["carrier"] });
    console.log(phoneDetails.carrier);

    // Here you would include the logic to send the OTP
    // For example:
    // const message = await client.messages.create({
    //   body: 'Your OTP code is 123456',
    //   from: 'your_twilio_phone_number',
    //   to: phoneNumber
    // });
    // res.status(200).json({ success: true, messageSid: message.sid });

    res.status(200).json({ success: true, carrier: phoneDetails.carrier });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});
//------------------------------------------------------
export const getNotification = asyncHandler(async (req, res) => {
  const { id } = req.user;
  console.log(id);
  const queryNotification =
    "select ImageId,noti_message,noti_status from image where ImageId in (select ImageId from report where FarmId in (select FarmId from farm where UserId=?)) order by ImageId asc";

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  Promise.resolve(queryDatabase(queryNotification, [id]))
    .then((result) => {
      if (result) {
        console.log("notification messages from notiCom: ", result);
        res.send(result);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "problem at getting notification" });
    });
});
//----------------------------------------
export const NotiStatus = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const changeNotiQuery =
    "update image set noti_status=? where ImageId in (select ImageId from report where FarmId in (select FarmId from farm where UserId=?))";
  const queryNotification =
    "select ImageId,noti_message,noti_status from image where ImageId in (select ImageId from report where FarmId in (select FarmId from farm where UserId=?)) order by ImageId asc";

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  Promise.resolve(queryDatabase(changeNotiQuery, [true, id]))
    .then(() => {
      return queryDatabase(queryNotification, [id])
        .then((result) => {
          if (result) {
            console.log("notification messages from notiCom: ", result);
            res.send(result);
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send({ message: "problem at getting notification" });
        });
    })
    .catch((err) => {
      res.status(500).send({ message: "error at updating" });
    });
});
