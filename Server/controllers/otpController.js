import twilio from "twilio";
import express from "express";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";

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
