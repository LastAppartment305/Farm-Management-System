import asyncHandler from "express-async-handler";
import { connection } from "../index.js";

export const getReportPhoto = asyncHandler(async (req, res) => {
  console.log(req.user.id);
  const { farmid } = req.body;

  const getImageIdFrom_worker_detail =
    "select ImageId from worker_detail where FarmId=19 and exists (select * from worker_detail where FarmId=19)";

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  Promise.resolve(
    queryDatabase(getImageIdFrom_worker_detail, [farmid, farmid])
  ).then((result) => {
    if (result) {
      console.log(result);
    } else {
      console.log("no report");
    }
  });
});
