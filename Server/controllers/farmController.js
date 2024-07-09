import { connection } from "../index.js";
import asyncHandler from "express-async-handler";
import fs from "fs/promises";

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
  // console.log("Farm Id: ", id);
  const getImagePath =
    "select ImageId,Image_path from image where ImageId in (select ImageId from report where FarmId=?)";
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

  const deleteFile = (file) => {
    return new Promise((resolve, reject) => {
      fs.unlink(file, (err) => {
        if (err) reject(err);
        resolve(`Deleted ${file}`);
      });
    });
  };

  Promise.resolve(queryDatabase(getImagePath, farmId)).then((result) => {
    console.log(result);

    const ids = [];
    if (result.length > 0) {
      result.forEach((e) => {
        ids.push(e.ImageId);
        deleteFile(e.Image_path);
      });
      console.log(ids);
      const placeHolder = ids.map(() => "?").join(", ");
      const deleteImage = `delete from image where ImageId in (${placeHolder})`;
      queryDatabase(deleteImage, ids).then(() => {});
    }
  });
  Promise.resolve(queryDatabase(getWorkerIdFromFarm, farmId))
    .then((result) => {
      if (result[0].WorkerId) {
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
              result.forEach((e) => {
                ids.push(e.ImageId);
              });
              console.log(ids);
              const placeHolder = ids.map(() => "?").join(", ");
              const deleteImage = `delete from image where ImageId in (${placeHolder})`;
              console.log(deleteImage);
              return queryDatabase(deleteImage, ids);
            }
          })
          .then(() => {
            return queryDatabase(deleteFarm, farmId);
          })
          .then(() => {
            console.log("deleted successfully");
            res.json({ message: "Data deleted successfully" });
          });
      } else {
        return queryDatabase(deleteFarm, farmId).then(() => {
          console.log("deleted successfully");
          res.json({ message: "Data deleted successfully" });
        });
      }
    })
    .catch((err) => {
      console.error("Error deleting data", err);
      res.status(500).json({ error: "An error occurred while deleting data" });
    });
});
