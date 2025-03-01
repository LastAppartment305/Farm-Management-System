import asyncHandler from "express-async-handler";
import { connection } from "../index.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const getReportPhoto = asyncHandler(async (req, res) => {
  const { postid } = req.body;
  const { id } = req.user;

  const batchSize = 50; // Adjust the batch size based on your database capacity
  let ids = [];
  let paths = [];
  let offset = 0;
  let hasMore = true;

  // const getNotiMessageAndStatus='select noti_message,noti_status from report where FarmId in(select FarmId from worker_detail where UserId=?)'
  // const getImageIdFrom_worker_detail = `select ImageId from report where FarmId=? and exists (select * from report where FarmId=?) limit ? offset ?`;

  const getImageIdFrom_worker_detail = `select ImageId from image where postid=? limit ? offset ?`;

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  res.writeHead(200, {
    "Content-Type": "application/json",
    "Transfer-Encoding": "chunked",
  });
  res.write("[");

  let isFirstBatch = true;
  while (hasMore) {
    const result = await queryDatabase(getImageIdFrom_worker_detail, [
      postid,
      batchSize,
      offset,
    ]);
    if (result.length > 0) {
      result.map((item, index) => {
        ids.push(item.ImageId);
      });
      offset += batchSize;
      const placeHolder = ids.map(() => "?").join(", ");
      const getImagePath = `select ImageId,Image_path,Report_date,Image_description,noti_message,noti_status,ConfirmStatus from image where ImageId in (${placeHolder})`;
      const imagePath = await queryDatabase(getImagePath, ids);
      imagePath.map((path) => {
        paths.push(
          // path
          // path.Image_path
          {
            ImageId: path.ImageId,
            filename: path.Image_path,
            date: path.Report_date,
            description: path.Image_description,
            noti_message: path.noti_message,
            noti_status: path.noti_status,
            ConfirmStatus: path.ConfirmStatus,
          }
        );
      });

      //response with stream

      paths.map((path) => {
        if (!isFirstBatch) {
          res.write(", ");
        }
        res.write(JSON.stringify(path));
        isFirstBatch = false;
      });
      ids.splice(0, ids.length);
      paths.splice(0, paths.length);
      // Check if this is the last batch
      if (result.length < batchSize) {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }
  }

  res.write("]");
  res.end();
});
//---------------------------------------------------------------------
export const getDownloadAuth = asyncHandler(async (req, res) => {
  const downladTokenExpirationTime = 24 * 60 * 60;
  const downloadTokenFileName = "./b2-downloadAuth.json";
  // console.log(req.user.id);
  const accountAuthTokenFileName = "./b2-accountAuth.json";
  const defaultExpirationTime = 24 * 60 * 60 * 1000;
  let b2AccountAuthToken = {
    token: null,
    expirationTime: null,
  };
  let b2DownloadToken = {
    token: null,
    expirationTime: null,
  };
  console.log("getDownloadauth");

  //load token from file
  const loadTokenFromFile = (filename, authtoken) => {
    console.log("load from file");
    if (fs.existsSync(filename)) {
      const data = JSON.parse(fs.readFileSync(filename, "utf-8"));
      // authtoken = {
      //   token: data.token,
      //   expirationTime: new Date(data.expirationTime),
      // };
      authtoken.token = data.token;
      authtoken.expirationTime = new Date(data.expirationTime);
    }
  };

  //save token to file
  function saveTokenToFile(filename, token) {
    fs.writeFileSync(filename, JSON.stringify(token));
  }

  const encodedCredentials = Buffer.from(
    `${process.env.BACKBLAZE_KEY_ID}:${process.env.BACKBLAZE_APPLICATION_KEY}`
  ).toString("base64");
  //get new token from b2 storage
  const fetchNewAuthToken = async () => {
    try {
      console.log("fetch New token");
      const response = await axios.get(
        "https://api.backblazeb2.com/b2api/v3/b2_authorize_account",
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        }
      );
      // console.log(response);
      const date = new Date();
      b2AccountAuthToken.token = response.data;
      if (response.data.applicationKeyExpirationTimestamp === null) {
        b2AccountAuthToken.expirationTime = new Date(
          date.getTime() + defaultExpirationTime
        );
      } else {
        b2AccountAuthToken.expirationTime = new Date(
          date.getTime() + response.data.applicationKeyExpirationTimestamp
        );
      }
      saveTokenToFile(accountAuthTokenFileName, b2AccountAuthToken);
      // console.log("fetch new token");
      // console.log(b2AccountAuthToken);
      return b2AccountAuthToken.token;
    } catch (error) {
      console.error("Error getting authorization token:", error);
    }
  };

  //------------------------------------------------------------
  //
  //---------start----------------------------------------
  const fetchNewDownloadToken = async (apiurl, authorizationToken) => {
    try {
      const response = await axios.post(
        `${apiurl}/b2api/v3/b2_get_download_authorization`,
        {
          bucketId: `64dd475ee7bf9ee1920d0118`,
          fileNamePrefix: "AungKaungMyat/",
          validDurationInSeconds: 24 * 60 * 60,
        },
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      );
      const now = new Date();
      b2DownloadToken.token = response.data;
      b2DownloadToken.expirationTime = new Date(
        now.getTime() + downladTokenExpirationTime
      );
      // console.log("download token: ", response);
      // saveTokenToFile(downloadTokenFileName, b2DownloadToken);

      return response;
    } catch (error) {
      console.log("Error at download token: ", error);
    }
  };
  //---------------end--------------------------------
  //
  //----------------------------------------------------------
  const getAuthorizationToken = async () => {
    try {
      const date = new Date();
      loadTokenFromFile(accountAuthTokenFileName, b2AccountAuthToken);
      if (
        b2AccountAuthToken.token &&
        b2AccountAuthToken.expirationTime > date
      ) {
        // console.log(b2AccountAuthToken);
        return b2AccountAuthToken.token;
      } else {
        return await fetchNewAuthToken();
      }
    } catch (error) {
      console.error("Error getting authorization token:", error);
    }
  };

  const downloadAuthToken = async (apiurl, authorizationToken) => {
    try {
      const now = new Date();
      loadTokenFromFile(downloadTokenFileName, b2DownloadToken);
      if (b2DownloadToken.token && b2DownloadToken.expirationTime > now) {
        return b2DownloadToken.token;
      } else {
        return await fetchNewDownloadToken(apiurl, authorizationToken);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  try {
    const authToken = await getAuthorizationToken();
    const downloadToken = await downloadAuthToken(
      authToken.apiInfo.storageApi.apiUrl,
      authToken.authorizationToken
    );

    // console.log("download Token :", downloadToken.data);

    res.send({
      downloadUrl: authToken.apiInfo.storageApi.downloadUrl,
      downloadToken: downloadToken.data,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
});
//-----------------------------------------------------------------
export const fetchB2Cloud = asyncHandler(async (req, res) => {
  const { downloadUrl, bucketName, fileName, downloadToken } = req.body;

  // console.log(bucketName, fileName);
  // console.log(`${downloadUrl}/file/${bucketName}/${fileName}`);
  const fetchImage = await axios.get(
    `${downloadUrl}/file/${bucketName}/AungKaungMyat/${fileName}`,
    {
      headers: {
        Authorization: downloadToken,
      },
      responseType: "arraybuffer", // Important for binary data
    }
  );
  // console.log(fetchImage);
  res.set("Content-Type", "image/jpeg");
  res.set("Content-Length", fetchImage.data.length);

  // Send the buffer as the response
  res.send(fetchImage.data);
});
//-------------------------------------------
export const ApprovedImageList = asyncHandler(async (req, res) => {
  const { postid } = req.body;
  const { id } = req.user;

  const batchSize = 50; // Adjust the batch size based on your database capacity
  let ids = [];
  let paths = [];
  let offset = 0;
  let hasMore = true;

  // const getNotiMessageAndStatus='select noti_message,noti_status from report where FarmId in(select FarmId from worker_detail where UserId=?)'
  // const getImageIdFrom_worker_detail = `select ImageId from report where FarmId=? and exists (select * from report where FarmId=?) limit ? offset ?`;

  const getImageId = `select ImageId from image where postid=? and ConfirmStatus=? limit ? offset ?`;

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  res.writeHead(200, {
    "Content-Type": "application/json",
    "Transfer-Encoding": "chunked",
  });
  res.write("[");

  let isFirstBatch = true;
  while (hasMore) {
    const result = await queryDatabase(getImageId, [
      postid,
      true,
      batchSize,
      offset,
    ]);
    if (result.length > 0) {
      result.map((item, index) => {
        ids.push(item.ImageId);
      });
      offset += batchSize;
      const placeHolder = ids.map(() => "?").join(", ");
      const getImagePath = `select ImageId,Image_path,Report_date,Image_description,noti_message,noti_status,ConfirmStatus from image where ImageId in (${placeHolder})`;
      const imagePath = await queryDatabase(getImagePath, ids);
      imagePath.map((path) => {
        paths.push(
          // path
          // path.Image_path
          {
            ImageId: path.ImageId,
            filename: path.Image_path,
            date: path.Report_date,
            description: path.Image_description,
            noti_message: path.noti_message,
            noti_status: path.noti_status,
            ConfirmStatus: path.ConfirmStatus,
          }
        );
      });

      //response with stream

      paths.map((path) => {
        if (!isFirstBatch) {
          res.write(", ");
        }
        res.write(JSON.stringify(path));
        isFirstBatch = false;
      });
      ids.splice(0, ids.length);
      paths.splice(0, paths.length);
      // Check if this is the last batch
      if (result.length < batchSize) {
        hasMore = false;
      }
    } else {
      hasMore = false;
    }
  }

  res.write("]");
  res.end();
});
