import { connection } from "../index.js";
import asyncHandler from "express-async-handler";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

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
      // const queryResult=await queryDatabase(sql,values);
      // if(queryResult){
      //   console.log("delete user successfully");
      //   res.json("user deleted successfully.")
      // }
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
            Promise.resolve(queryDatabase(sql, values))
              .then(() => {
                res
                  .status(200)
                  .send({ message: "worker deleted successfully" });
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
          .then(() => {})
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
  // connection.query(sql,values,(err,result)=>{
  //   if(err){
  //     console.error("Error deleting data" , err);
  //     res.status(500).json({error:"An error occurred while deleting data"});

  //   }else{
  //     console.log("deleted successfully");
  //     res.json({message:"Data deleted successfully"});
  //   }
  // })
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
  const { url } = req.body;
  const { farmid, workerid, userid } = req.worker;
  // console.log("dashboardController", farmid, workerid);
  const insertImageIdTo_image =
    "insert into image (Report_date,Image_path) values (?,?)";
  const checkNullAtImageId =
    "select ImageId from worker_detail where FarmId=? and WorkerId=?";
  const updateImageIdTo_worker_detail =
    "update worker_detail set ImageId=? where FarmId=? and WorkerId=?";
  const insertEntireRowTo_worker_detail =
    "insert into worker_detail (FarmId,WorkerId,UserId,ImageId) values (?,?,?,?)";
  const extractImageId = "select ImageId from image where Image_path=?";
  // console.log(url);

  const isoDate = new Date();
  const mySQLDateString = isoDate.toJSON().slice(0, 19).replace("T", " ");

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

  const valuesToInsert_image = [mySQLDateString, filePath];
  const valuesToCheckNullImageId = [farmid, workerid];
  const valuesForInsertEntireRow = [farmid, workerid, userid];
  const valueForExtractImageId = [filePath];

  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "File upload failed", error: err.message });
    }
    Promise.resolve(queryDatabase(insertImageIdTo_image, valuesToInsert_image))
      .then(async (response) => {
        if (response) {
          const queryResult = await queryDatabase(checkNullAtImageId, [
            farmid,
            workerid,
          ]);
          return {
            queryResult,
            id: response.insertId,
          };
        }

        console.log(`upload ${filename} at ${mySQLDateString}`);
      })
      .then((result) => {
        if (result) {
          console.log("insertedId", result.queryResult[0].ImageId, result.id);
          if (result.queryResult[0].ImageId) {
            return queryDatabase(insertEntireRowTo_worker_detail, [
              farmid,
              workerid,
              userid,
              result.id,
            ]);
          } else {
            return queryDatabase(updateImageIdTo_worker_detail, [
              result.id,
              farmid,
              workerid,
            ]);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({ message: "unexpected error occur at upload" });
      });
    res
      .status(200)
      .json({ message: "Upload successful", file: `uploads/${filename}` });
  });
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
