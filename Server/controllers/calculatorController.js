import asyncHandler from "express-async-handler";
import { connection } from "../index.js";
export const getOverallData = asyncHandler(async (req, res) => {
  //   console.log(req.body);
  const { crop } = req.body;

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const cropInfo = "select * from crop where Name=?";
  const overallInformation = "select * from wage where CropId=?";
  const queryChemicalInfo = "select * from chemical where CropId=?";
  const queryJob =
    "select * from job where JobId in (select JobId from wage where CropId=?)";
  const queryChemical = "select * from chemical where CropId=?";
  const Jobs = (ids) => {
    const placeholders = ids.map(() => "?").join(", ");
    return `select * from jobcategory where JobId in (${placeholders})`;
  };

  //   Promise.resolve(queryDatabase(cropInfo, [crop])).then((result) => {
  //     console.log("overall information", result);
  //     if (result[0]) {
  //       return queryDatabase(overallInformation, [result[0].CropId]).then(
  //         (overallinfo) => {
  //           console.log(overallinfo);
  //         }
  //       );
  //     }
  //   });

  const getCropAndOverallInfo = async (crop) => {
    try {
      // First query to get crop information
      let combinedResult = {
        cropInfo: [], // Assuming cropResult is an array and we need the first element
        overallInfo: [],
        job: [],
        chemical: [],
      };
      const cropResult = await queryDatabase(cropInfo, [crop]);

      // If the crop information exists, fetch the overall information
      if (cropResult[0]) {
        combinedResult.cropInfo = cropResult[0];
        const overallResult = await queryDatabase(overallInformation, [
          cropResult[0].CropId,
        ]);
        if (overallResult[0]) {
          combinedResult.overallInfo = overallResult;

          // const JobIds = combinedResult.overallInfo.map((data) => data.JobId);
          // const generateJobQuery = Jobs(combinedResult.overallInfo);
          const getJobs = await queryDatabase(queryJob, cropResult[0].CropId);
          combinedResult.job = getJobs;
          const getchemical = await queryDatabase(
            queryChemical,
            cropResult[0].CropId
          );
          combinedResult.chemical = getchemical;
        }
      }

      // Return or send the combined result
      // console.log(combinedResult);
      return combinedResult;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error; // or handle the error as needed
    }
  };
  const result = await getCropAndOverallInfo(crop);
  res.send(result);
  console.log(result);
});
