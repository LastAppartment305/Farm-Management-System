import { connection } from "../index.js";
import asyncHandler from "express-async-handler";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import axios from "axios";
import { json } from "express";

dotenv.config();

//retrieve data for dashboard
export const retrieveDataForDashboard = asyncHandler(async (req, res) => {
  const tableData = {
    user: "",
    worker: "",
    farm: "",
  };
  const sqlUser = "select * from user";
  const sqlWorker = "select * from worker";
  const sqlFarm = "select * from farm";

  const queryDatabase = (sql) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };

  Promise.all([
    queryDatabase(sqlUser),
    queryDatabase(sqlWorker),
    queryDatabase(sqlFarm),
  ])
    .then(([userResult, workerResult, farmResult]) => {
      tableData.user = userResult;
      tableData.worker = workerResult;
      tableData.farm = farmResult;
      res.json(tableData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
});
//-------------------------------------------------------------------------------
export const retrieveWorkerDataForOwner = asyncHandler(async (req, res) => {
  const tableData = {
    worker: "",
  };
  const sqlWorker =
    "select * from worker where WorkerId in (select WorkerId from worker_detail where UserId=?)";
  const UserId = req.user.id;
  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };
  Promise.all([queryDatabase(sqlWorker, UserId)])
    .then(([workerResult]) => {
      //console.log(workerResult)
      tableData.worker = workerResult;
      res.json(tableData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
});
//---------------------------------------------------------------------
export const createWorker = asyncHandler(async (req, res) => {
  const detail = {
    worker: "",
    worker_detail: "",
  };
  const isoDate = new Date();
  const mySQLDateString = isoDate.toJSON().slice(0, 19).replace("T", " ");
  const { name, gender, phone, address, age } = req.body;
  const UserId = req.user.id;
  console.log("Owner id", UserId);

  const retrieveId = "select WorkerId from worker where Phone_no = ?";
  const insertToWorker =
    "insert into worker(Name,Gender,Phone_no,Address,Age,Created_at) values(?,?,?,?,?,?)";
  const insertToWorker_Detail =
    "insert into worker_detail(UserId,WorkerId) values(?,?)";
  const valueForWorker = [name, gender, phone, address, age, mySQLDateString];

  const phoneNo = [phone];

  //function to query database
  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const resolvePromise = Promise.resolve(
    queryDatabase(insertToWorker, valueForWorker)
  );
  resolvePromise
    .then(async (value) => {
      console.log("Id of worker : ", value.insertId);
      const vlaueForWorker_Detail = [UserId, value.insertId];
      const queryResult = await queryDatabase(
        insertToWorker_Detail,
        vlaueForWorker_Detail
      );
      if (queryResult) {
        console.log(" success.");
        res.json({ message: "Data inserted successfully" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
});
//--------------------------------------------------------------------
export const deleteUser = asyncHandler(async (req, res) => {
  console.log("User Id to delete", req.body);
  const { id } = req.body;
  const sql = "delete from user where UserId = ?";
  const delete_data_from_workerDetail =
    "delete from worker_detail where UserId=?";
  const select_data_from_worker =
    "select WorkerId from worker where WorkerId in(select WorkerId from worker_detail where UserId=?)";

  //function to generate delete query that use multiple WorkerId to delete at the same time
  const delete_data_from_worker = (ids) => {
    const placeholders = ids.map(() => "?").join(", ");
    return `delete from worker where WorkerId in (${placeholders})`;
  };
  const values = [id];

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  //retrieve WorkerId from worker_detail table according UserId
  const resolvePromise = Promise.resolve(
    queryDatabase(select_data_from_worker, values)
  );
  resolvePromise
    .then(async (ids) => {
      const workerIds = ids.map((data) => data.WorkerId); //store WorkerId in a variable before deleting data from worker_detail

      Promise.resolve(queryDatabase(delete_data_from_workerDetail, values)) //delete data from worker_detail table first
        .then(async () => {
          const deleteQuery = delete_data_from_worker(workerIds); //call function
          Promise.all([
            queryDatabase(deleteQuery, workerIds),
            queryDatabase(sql, values),
          ]) //after deleting worker_detail then delete both user and worker
            .then(([workerResult, userResult]) => {
              if (workerResult && userResult) {
                console.log("deleted user successfully.");
              }
            })
            .catch((err) => {
              console.error(err);
              res.status(500).send("An error occurred");
            });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("An error occurred");
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred");
    });
});
//-----------------------------------------------------------------
export const deleteWorker = asyncHandler(async (req, res) => {
  //console.log("Worker Id to delete",req.body)
  const { id } = req.body;

  const retrieve_data_worker_detail =
    "select * from worker_detail where WorkerId=?";
  const setNullToWorkerId = "update farm set WorkerId=null where FarmId=?";
  const setNullExceptWorkerId =
    "update worker_detail set FarmId=null,UserId=null where WorkerId=?";
  const sql = "delete from worker where WorkerId = ?";
  const values = [id];

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  Promise.resolve(queryDatabase(retrieve_data_worker_detail, values))
    .then((result) => {
      if (result[0].FarmId) {
        const farm_id = result[0].FarmId;
        Promise.resolve(queryDatabase(setNullToWorkerId, farm_id))
          .then(() => {
            Promise.resolve(queryDatabase(setNullExceptWorkerId, values))
              .then(() => {
                Promise.resolve(queryDatabase(sql, values)).then(() => {
                  res.clearCookie("workerAuth");
                  res
                    .status(200)
                    .send({ message: "worker deleted successfully" });
                });
              })
              .catch((err) => {
                console.error(err);
                res
                  .status(500)
                  .send({ message: "error occur at deleting data" });
              });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "error occur at changing data" });
          });
        //console.log("farm id exist")
      } else {
        Promise.resolve(queryDatabase(sql, values))
          .then(() => {
            res.clearCookie("workerAuth");
            res.status(200).send({ message: "worker deleted successfully" });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "error occur at deleting data" });
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "error occur at retrieving data" });
    });
});

//---------------------------------------------------------------
export const editWorker = asyncHandler(async (req, res) => {
  //console.log(req.body);
  const { id } = req.body;
  const { name, gender, phone, address, age } = req.body.data;

  const edit_worker_query =
    "update worker set Name=?,Gender=?,Phone_no=?,Address=?,Age=? where WorkerId=?";
  const value_for_worker_edit = [name, gender, phone, address, age, id];

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  Promise.resolve(queryDatabase(edit_worker_query, value_for_worker_edit))
    .then(() => {
      res.status(200).send({ message: "update worker data successful" });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send({ message: "unexpected error occur while updating worker data" });
    });
});
//------------------------------------------------------------
export const receiveUploadPhoto = asyncHandler(async (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const { url, description, postid } = req.body;
  const { username, workerid } = req.worker;
  console.log("postid", postid);
  const accountAuthTokenFileName = "./b2-accountAuth.json";
  const defaultExpirationTime = 24 * 60 * 60 * 1000;
  // console.log("dashboardController", farmid, workerid);
  const insertImageIdTo_image =
    "insert into image (Report_date,Image_path,upload_fileId,Image_description,noti_message,noti_status,PostId) values (?,?,?,?,?,?,?)";
  const connectImageIdWithFarmId =
    "insert into report (FarmId,ImageId) values (?,?)";
  const getUserName =
    "select Name from user where UserId in (select UserId from post_general_info where PostId=?)";
  const getCropInfo =
    "select CropName,Acre from post_general_info where PostId=?";

  let b2AccountAuthToken = {
    token: null,
    expirationTime: null,
  };
  // const isoDate = new Date();
  // const mySQLDateString = isoDate.toJSON().slice(0, 19).replace("T", " ");
  const localDate = new Date();

  // Format date parts to ensure two digits
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");
  const hours = String(localDate.getHours()).padStart(2, "0");
  const minutes = String(localDate.getMinutes()).padStart(2, "0");
  const seconds = String(localDate.getSeconds()).padStart(2, "0");

  const mySQLDateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const uploadDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  //generate file name
  const generateUniqueFilename = (extension) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    return `image-${uniqueSuffix}.${extension}`;
  };

  const matches = url.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return res.status(400).json({ message: "Invalid base64 string" });
  }

  const buffer = Buffer.from(matches[2], "base64");

  console.log(`Buffer size: ${buffer.length}`);
  const extension = matches[1];
  const filename = generateUniqueFilename(extension);

  const filePath = path.join(uploadDir, filename);

  //
  //
  //
  //Codes below store image in b2-cloud-storage (backblaze Api)
  //
  //
  //
  const encodedCredentials = Buffer.from(
    `${process.env.BACKBLAZE_KEY_ID}:${process.env.BACKBLAZE_APPLICATION_KEY}`
  ).toString("base64");

  //load token from file
  const loadTokenFromFile = () => {
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

  //get new token from b2 storage
  const fetchNewAuthToken = async () => {
    try {
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

  const getUploadUrl = async (apiurl, authorizationToken) => {
    try {
      const response = await axios.get(`${apiurl}/b2api/v3/b2_get_upload_url`, {
        params: { bucketId: `64dd475ee7bf9ee1920d0118` },
        headers: {
          Authorization: authorizationToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting upload URL:", error.response.data);
      throw error;
    }
  };

  const uploadImage = async (
    uploadurl,
    imagebinary,
    authorizationToken,
    filename
  ) => {
    try {
      const response = await axios.post(uploadurl, imagebinary, {
        headers: {
          Authorization: authorizationToken,
          "X-Bz-File-Name": encodeURIComponent(`AungKaungMyat/${filename}`),
          "Content-Type": "b2/x-auto",
          "X-Bz-Content-Sha1": "do_not_verify",
          "Content-Length": imagebinary.length,
        },
      });

      return response;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  try {
    const authToken = await getAuthorizationToken();
    const uploadUrl = await getUploadUrl(
      authToken.apiInfo.storageApi.apiUrl,
      authToken.authorizationToken
    );
    const uploadResult = await uploadImage(
      uploadUrl.uploadUrl,
      buffer,
      uploadUrl.authorizationToken,
      filename
    );
    // console.log(uploadResult.data.fileId);
    Promise.all([
      queryDatabase(getUserName, [postid]),
      queryDatabase(getCropInfo, [postid]),
    ])
      .then(([userName, cropInfo]) => {
        if (userName && cropInfo) {
          console.log(userName);
          console.log(cropInfo);
        }
        const valuesToInsert_image = [
          mySQLDateString,
          filename,
          uploadResult.data.fileId,
          description,
          `${username} မှ ${userName[0].Name}၏ ${cropInfo[0].CropName} ${cropInfo[0].Acre} အတွက် ဓာတ်ပုံပို့ထားပါသည်`,
          false,
          postid,
        ];
        //store file name in database
        Promise.resolve(
          queryDatabase(insertImageIdTo_image, valuesToInsert_image)
        ).then(async (response) => {
          console.log("inserted data to image table : ", response);
          // if (response) {
          //   const workerName = await queryDatabase(getWorkerName, [workerid]);
          //   if (workerName) {
          //     console.log("workerName: ", workerName[0].Name);
          //   }
          //   const farmName = await queryDatabase(getFarmName, [farmid]);
          //   if (farmName) {
          //     console.log("farm name: ", farmName);
          //   }
          //   const queryResult = await queryDatabase(connectImageIdWithFarmId, [
          //     farmid,
          //     response.insertId,
          //   ]);
          //   return {
          //     queryResult,
          //   };
          // }
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ message: "unexpected error occur at upload" });
      });
    res
      .status(200)
      .json({ message: "Upload successful", file: `uploads/${filename}` });
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
});
//-----------------------------------------------------------------------
export const assignWorkerToFarm = asyncHandler(async (req, res) => {
  //console.log(req.body)
  const { workerId, farmId } = req.body;
  const getWorkerId = "select WorkerId from farm where FarmId=?";
  const setNullToFarmId_worker_detail =
    "update worker_detail set FarmId=null where WorkerId=?";
  const insert_WorkerId_ToFarm = "update farm set WorkerId=? where FarmId=?";
  const insert_farmId_Toworker_detail =
    "update worker_detail set FarmId=? where WorkerId=?";

  const valueFor_insert_WorkerId_ToFarm = [workerId, farmId];
  const valueFor_insert_FarmId_Toworker_detail = [farmId, workerId];
  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  Promise.resolve(queryDatabase(getWorkerId, [farmId]))

    .then((result) => {
      if (result[0].WorkerId) {
        // console.log("exist");
        Promise.resolve(
          queryDatabase(setNullToFarmId_worker_detail, [result[0].WorkerId])
        )
          .then(() => {
            return queryDatabase(
              insert_WorkerId_ToFarm,
              valueFor_insert_WorkerId_ToFarm
            );
          })
          .then(() => {
            return queryDatabase(
              insert_farmId_Toworker_detail,
              valueFor_insert_FarmId_Toworker_detail
            );
          })
          .then(() => {
            res.send({ message: "assign worker successful" });
          });
      } else {
        // console.log("id not exist");
        Promise.resolve(
          queryDatabase(insert_WorkerId_ToFarm, valueFor_insert_WorkerId_ToFarm)
        )
          .then(() => {
            return queryDatabase(
              insert_farmId_Toworker_detail,
              valueFor_insert_FarmId_Toworker_detail
            );
          })
          .then(() => {
            res.send({ message: "assign worker successful" });
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send({ message: "unexpected error occur at assign worker" });
    });
});
//---------------------------------------------------------------------
export const deleteAssignWorkerFromFarm = asyncHandler(async (req, res) => {
  // console.log(req.body.id.farmid)
  const { farmid, workerid } = req.body.id;

  const delete_assign_worker = "update farm set WorkerId=null where FarmId=?";
  const delete_farmId_from_worker_detail =
    "update worker_detail set FarmId=null where WorkerId=?";
  const value_to_delete_assign_worker = [farmid];
  const value_for_worker_detail = [workerid];

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  Promise.resolve(
    queryDatabase(delete_farmId_from_worker_detail, value_for_worker_detail)
  )
    .then(() => {
      Promise.resolve(
        queryDatabase(delete_assign_worker, value_to_delete_assign_worker)
      )
        .then(() => {
          res.clearCookie("workerAuth");
          // console.log("cookie cleared");
          res
            .status(200)
            .send({ message: "successfully delete assign worker" });
        })
        .catch((err) => {
          console.error(err);
          res
            .status(500)
            .send({ message: "error occur at deleting worker id" });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message:
          "unexpected error occur at deleting farm id from worker detail",
      });
    });
});
//--------------------------------------------------------
export const retrieveWorkerInfo = asyncHandler(async (req, res) => {
  const { workerid } = req.worker;
  console.log(workerid);
  const retrieveWorker = "select * from worker where WorkerId=?";
  const values = [workerid];

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  };

  Promise.resolve(queryDatabase(retrieveWorker, values))
    .then(([result]) => {
      if (result.WorkerId) {
        console.log(result);
        res.send(result);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
//-----------------------------------------------
export const postListsForAdmin = asyncHandler(async (req, res) => {
  // console.log("postListforAdmin approve report");
  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const sql =
    "select p.*,u.Name,i.ConfirmStatus from post_general_info p join user u on p.UserId=u.UserId join image i on p.PostId=i.PostId where ApproveStatus=? and WorkerId is not null GROUP BY p.PostId";

  const retrievePosts = async () => {
    try {
      let combinedResult = {
        list: null,
        haveUnapprovedImagePosts: null,
      };
      const postLists = await queryDatabase(sql, [1]);
      if (postLists.length > 0) {
        combinedResult.list = postLists;
        let ids = [];
        postLists.map((i) => ids.push(i.PostId));
        let tempArray = "";
        ids?.map((i) => {
          if (tempArray.length != 0) {
            tempArray = tempArray + ",?";
          } else {
            tempArray = tempArray + "?";
          }
        });
        const queryUnapprovedImages = `select PostId from image where ConfirmStatus is null and PostId in (${tempArray}) group by PostId`;
        const unapprovedImages = await queryDatabase(
          queryUnapprovedImages,
          ids
        );
        if (unapprovedImages) {
          combinedResult.haveUnapprovedImagePosts = unapprovedImages;
          res.send(combinedResult);
          console.log("image list: ", unapprovedImages);
        }
        // postDetail.postInfo = console.log("post for admin", postLists);
      } else {
        res.send(postLists);
      }
    } catch (err) {
      console.error("Error at retrieving posts", err);
    }
  };
  try {
    await retrievePosts();
  } catch (err) {
    console.error("Error at retrieving posts");
  }
});
//----------------------------------------------
export const confirmToImages = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { imageId, confirmStatus } = req.body;

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const sql = "update image set ConfirmStatus=? where ImageId=?";

  const changeConfirmStatus = async () => {
    try {
      const changeResult = await queryDatabase(sql, [confirmStatus, imageId]);
      res.send(changeResult);
    } catch (err) {
      console.error("Error at changing status: ", err);
    }
  };

  try {
    await changeConfirmStatus();
  } catch (err) {
    console.error("error at calling function", err);
  }
});
//-----------------------------------------
export const getList = asyncHandler(async (req, res) => {
  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const sql =
    "select w.* from worker w join post_general_info p on w.WorkerId=p.WorkerId where UserId=?";

  Promise.resolve(queryDatabase(sql, [req.user.id])).then((result) => {
    if (result) {
      res.send(result);
    }
  });
});
