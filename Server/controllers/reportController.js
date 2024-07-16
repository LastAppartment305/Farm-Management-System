import asyncHandler from "express-async-handler";
import { connection } from "../index.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const getReportPhoto = asyncHandler(async (req, res) => {
  // console.log(req.user.id);
  const { farmid } = req.body;

  const batchSize = 3; // Adjust the batch size based on your database capacity
  let ids = [];
  let paths = [];
  let offset = 0;
  let hasMore = true;
  const getImageIdFrom_worker_detail = `select ImageId from report where FarmId=? and exists (select * from report where FarmId=?) limit ? offset ?`;

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
      farmid,
      farmid,
      batchSize,
      offset,
    ]);
    if (result.length > 0) {
      result.map((item, index) => {
        ids.push(item.ImageId);
      });
      offset += batchSize;
      const placeHolder = ids.map(() => "?").join(", ");
      const getImagePath = `select Image_path from image where ImageId in (${placeHolder})`;
      const imagePath = await queryDatabase(getImagePath, ids);
      imagePath.map((path) => {
        paths.push(
          // path
          path.Image_path.replace(
            "/media/aungkaungmyat/Data/learn react/Practices/Intern Project module collection/Farm-management-system/Server/",
            ""
          )
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
  const accountAuthTokenFileName = "./b2-accountAuth.json";
  const defaultExpirationTime = 24 * 60 * 60 * 1000;
  let b2AccountAuthToken = {
    token: null,
    expirationTime: null,
  };
  console.log("getDownloadauth");

  //load token from file
  const loadTokenFromFile = () => {
    console.log("load from file");
    if (fs.existsSync(accountAuthTokenFileName)) {
      const data = JSON.parse(
        fs.readFileSync(accountAuthTokenFileName, "utf-8")
      );
      b2AccountAuthToken = {
        token: data.token,
        expirationTime: new Date(data.expirationTime),
      };
    }
  };

  //save token to file
  function saveTokenToFile() {
    fs.writeFileSync(
      accountAuthTokenFileName,
      JSON.stringify(b2AccountAuthToken)
    );
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
          data.getTime() + response.data.applicationKeyExpirationTimestamp
        );
      }
      saveTokenToFile();
      // console.log("fetch new token");
      // console.log(b2AccountAuthToken);
      return b2AccountAuthToken.token;
    } catch (error) {
      console.error("Error getting authorization token:", error);
    }
  };

  const getAuthorizationToken = async () => {
    try {
      const date = new Date();
      loadTokenFromFile();
      if (
        b2AccountAuthToken.token &&
        b2AccountAuthToken.expirationTime > date
      ) {
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
      return response;
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

    console.log(authToken);
    res.send({
      downloadUrl: authToken.apiInfo.storageApi.downloadUrl,
      downloadToken: downloadToken.data,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
});
