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
//------------------------------------------------------
export const storePostData = asyncHandler(async (req, res) => {
  // console.log(req.body);
  // console.log("ownerId", req.user.id);

  const insertIntoPostGeneralInfo =
    "INSERT INTO post_general_info(UserId, Date, Acre, CropName) VALUES (?, ?, ?, ?)";

  const localDate = new Date();

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");
  const hours = String(localDate.getHours()).padStart(2, "0");
  const minutes = String(localDate.getMinutes()).padStart(2, "0");
  const seconds = String(localDate.getSeconds()).padStart(2, "0");
  const mySQLDateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  const queryDatabase = (sql, values) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, values, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const insertJobDetails = async (postId, cropDetails) => {
    const jobCategories = [
      "pesticide",
      "herbicide",
      "fertilizer",
      "harvesting",
      "irrigation",
      "fungicide",
      "plowing",
      "transplanting",
      "seeding",
    ];

    for (const category of jobCategories) {
      if (cropDetails[category]) {
        const values = [
          postId,
          getJobIdByCategory(category),
          cropDetails[category].WagePerLabor,
          cropDetails[category].ChemicalPrice,
          cropDetails[category].TotalWagePerJob,
          cropDetails[category].LaborNeed,
          cropDetails[category].TotalLaborPerJob,
          cropDetails[category].TotalCostPerJob,
        ];

        const sql = `
          INSERT INTO post_job_info (PostId, JobId, WagePerLabor, ChemicalPrice, TotalWagePerJob, LaborNeed, TotalLaborPerJob, TotalCostPerJob)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        try {
          await queryDatabase(sql, values);
          console.log("Inserted row for job category:", category);
        } catch (err) {
          console.error("Error inserting job details:", err);
        }
      }
    }
  };
  const insertTotalCosts = async (postId) => {
    const sql =
      "insert into post_total_cost(PostId,TotalChemicalPrice,TotalWage,TotalMachineryCost,TotalExpense) values(?,?,?,?,?)";
    try {
      await queryDatabase(sql, [
        postId,
        req.body.TotalChemicalPrice,
        req.body.TotalWage,
        req.body.TotalMachineryCost,
        req.body.TotalExpense,
      ]);
      console.log("inserting total costs success");
    } catch (err) {
      console.error("Error inserting total costs", err);
    }
  };
  const getJobIdByCategory = (category) => {
    const jobIdMap = {
      pesticide: 1,
      herbicide: 2,
      fertilizer: 3,
      harvesting: 4,
      irrigation: 5,
      fungicide: 6,
      plowing: 7,
      transplanting: 8,
      seeding: 9,
    };
    return jobIdMap[category];
  };

  try {
    const result = await queryDatabase(insertIntoPostGeneralInfo, [
      req.user.id,
      mySQLDateString,
      req.body.Acre,
      req.body.Cropname,
    ]);

    if (result.insertId) {
      await insertJobDetails(result.insertId, req.body);
      await insertTotalCosts(result.insertId);
    }

    res.status(200).json({ message: "Data inserted successfully" });
  } catch (error) {
    console.error("Error storing post data:", error);
    res.status(500).json({ message: "Failed to insert data" });
  }
});
