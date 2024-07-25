import { connection } from "../index.js";
import asyncHandler from "express-async-handler";
import fs from "fs";
import axios from "axios";

export const addNewFarm = asyncHandler(async (req, res) => {
  const { crop_type, location, field_name } = req.body;
  const isoDate = new Date();
  const mySQLDateString = isoDate.toJSON().slice(0, 19).replace("T", " ");

  const insertToFarm =
    "insert into farm(Crop_type,Location,UserId,Name,created_at) values(?,?,?,?,?)";
  const insertToFarmValues = [
    crop_type,
    location,
    req.user.id,
    field_name,
    mySQLDateString,
  ];

  connection.query(insertToFarm, insertToFarmValues, (err, result) => {
    if (err) {
      console.error("Error inserting data", err);
      res.status(500).json({ error: "An error occurred while inserting data" });
    } else {
      console.log("inserted successfully");
      res.json({ message: "Data inserted successfully" });
    }
  });
});
//-------------------------------------------------------------
export const retrieveFarmList = asyncHandler(async (req, res) => {
  const getFarmList = "select * from farm where UserId=?";

  const value = [req.user.id];

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  Promise.all([queryDatabase(getFarmList, value)])
    .then(([result]) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
});
//-------------------------------------------
export const deleteFarm = asyncHandler(async (req, res) => {
  // console.log("User Id to delete", req.body);
  const { id } = req.body;
  const accountAuthTokenFileName = "./b2-accountAuth.json";
  const defaultExpirationTime = 24 * 60 * 60 * 1000;
  let b2AccountAuthToken = {
    token: null,
    expirationTime: null,
  };

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

  function saveTokenToFile(filename, token) {
    fs.writeFileSync(filename, JSON.stringify(token));
  }
  //
  //
  //-----------------fetch new account auth token ----------------
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
  //-------------------------------------------------------------------
  //
  //

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

  //-----------------------------------------------------------------

  // console.log("Farm Id: ", id);
  const getImagePath =
    "select ImageId,Image_path,upload_fileId from image where ImageId in (select ImageId from report where FarmId=?)";
  const deleteFarm = "delete from farm where FarmId = ?";
  const getWorkerIdFromFarm = "select WorkerId from farm where FarmId=?";
  const setNullToFarmId_worker_detail =
    "update worker_detail set FarmId=null where WorkerId=?";
  const setNullToWorkerId_farm = "update farm set WorkerId=null where FarmId=?";

  const farmId = [id];

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  // const deleteFile = (file) => {
  //   return new Promise((resolve, reject) => {
  //     fs.unlink(file, (err) => {
  //       if (err) reject(err);
  //       resolve(`Deleted ${file}`);
  //     });
  //   });
  // };

  // Promise.resolve(queryDatabase(getImagePath, farmId)).then((result) => {
  //   console.log(result);

  //   const ids = [];
  //   if (result.length > 0) {
  //     result.forEach((e) => {
  //       ids.push(e.ImageId);
  //       deleteFile(e.Image_path);
  //     });
  //     console.log(ids);
  //     const placeHolder = ids.map(() => "?").join(", ");
  //     const deleteImage = `delete from image where ImageId in (${placeHolder})`;
  //     queryDatabase(deleteImage, ids).then(() => {});
  //   }
  // });
  Promise.resolve(queryDatabase(getWorkerIdFromFarm, farmId))
    .then(async (result) => {
      if (result[0].WorkerId) {
        console.log(result);
        return queryDatabase(setNullToFarmId_worker_detail, [
          result[0].WorkerId,
        ])
          .then(() => {
            return queryDatabase(setNullToWorkerId_farm, farmId);
          })
          .then(() => {
            return queryDatabase(getImagePath, farmId);
          })
          .then((result) => {
            const ids = [];
            if (result.length > 0) {
              console.log(result);
              result.forEach(async (e) => {
                ids.push(e.ImageId);
                const authToken = await getAuthorizationToken();
                const deleteResult = await axios.post(
                  `${authToken.apiInfo.storageApi.apiUrl}/b2api/v3/b2_delete_file_version`,
                  {
                    fileName: `AungKaungMyat/${e.Image_path}`,
                    fileId: e.upload_fileId,
                    bypassGovernance: true,
                  },
                  {
                    headers: {
                      Authorization: authToken.authorizationToken,
                    },
                  }
                );
                console.log(
                  "delete images from server results: ",
                  deleteResult.data
                );
              });
              console.log(ids);
              const placeHolder = ids.map(() => "?").join(", ");
              const deleteImage = `delete from image where ImageId in (${placeHolder})`;
              // console.log(deleteImage);
              return queryDatabase(deleteImage, ids);
            } else {
              console.log(
                `${req.user.username} deleted a farm with no reports.`
              );
            }
          })
          .then(() => {
            res.clearCookie("workerAuth");
            return queryDatabase(deleteFarm, farmId);
          })
          .then(() => {
            console.log("deleted successfully");
            res.json({ message: "Data deleted successfully" });
          });
      } else {
        return queryDatabase(getImagePath, farmId)
          .then(async (result) => {
            const ids = [];
            if (result.length > 0) {
              result.forEach(async (e) => {
                ids.push(e.ImageId);
                const authToken = await getAuthorizationToken();
                const deleteResult = await axios.post(
                  `${authToken.apiInfo.storageApi.apiUrl}/b2api/v3/b2_delete_file_version`,
                  {
                    fileName: `AungKaungMyat/${e.Image_path}`,
                    fileId: e.upload_fileId,
                    bypassGovernance: true,
                  },
                  {
                    headers: {
                      Authorization: authToken.authorizationToken,
                    },
                  }
                );
                console.log(
                  "delete images from server results: ",
                  deleteResult.data
                );
              });
              const placeHolder = ids.map(() => "?").join(", ");
              const deleteImage = `delete from image where ImageId in (${placeHolder})`;
              // console.log(deleteImage);

              return queryDatabase(deleteImage, ids);
            } else {
              console.log(
                `${req.user.username} deleted a farm with no reports.`
              );
            }
          })
          .then(() => {
            res.clearCookie("workerAuth");
            return queryDatabase(deleteFarm, farmId);
          })
          .then(() => {
            console.log("deleted successfully");
            res.json({ message: "Farm deleted successfully" });
          });
      }
    })
    .catch((err) => {
      console.error("Error deleting data", err);
      res.status(500).json({ error: "An error occurred while deleting data" });
    });
});
