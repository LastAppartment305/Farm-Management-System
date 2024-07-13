import asyncHandler from "express-async-handler";
import { connection } from "../index.js";
import fs from "fs";

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
          path.Image_path.replace(
            "/media/aungkaungmyat/Data/learn react/Practices/Intern Project module collection/Farm-management-system/Server/",
            ""
          )
        );
      });

      // console.log(ids);
      // console.log(paths);
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Transfer-Encoding": "chunked",
      });
      res.write("[");
      paths.map((path) => {
        res.write(JSON.stringify(path) + ", ");
      });
      res.write("]");
      res.end();
      // const stream = fs.createReadStream({ path: paths });
      // stream.pipe(res);
      ids.splice(0, ids.length);
      paths.splice(0, paths.length);
    } else {
      hasMore = false;
    }
  }
  // res.send({ path: paths });
});
