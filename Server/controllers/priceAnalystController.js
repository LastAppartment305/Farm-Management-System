import asyncHandler from "express-async-handler";
import { connection } from "../index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const registerAnalyst = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, phone, password, NRC, address, age } = req.body.data;

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const storePassword = async (plainPassword) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  };
  const encodedPassword = await storePassword(password);
  const checkPhoneNo =
    "select Phone_no,NRC from price_analyst where Phone_no=?";
  const checkName = "select Name from price_analyst where Name=?";
  const checkNRC = "select NRC from price_analyst where NRC=?";
  const sql = `insert into price_analyst(Name,NRC,Password,Phone_no,Age,Address) values(?,?,?,?,?,?)`;
  Promise.resolve(queryDatabase(checkName, [name])).then((result) => {
    // console.log(result);
    if (!result[0]) {
      return queryDatabase(checkPhoneNo, [phone]).then((phoneResult) => {
        if (!phoneResult[0]) {
          return queryDatabase(checkNRC, [NRC]).then((NRCResult) => {
            if (!NRCResult[0]) {
              connection.query(
                sql,
                [name, NRC, encodedPassword, phone, age, address],
                function (err, result) {
                  if (err) {
                    console.error("Error inserting data:", err);
                    res.status(500).json({
                      error: "An error occurred while inserting data",
                    });
                  } else {
                    console.log("Data inserted successfully!");
                    res.json({ status: true });
                  }
                }
              );
            } else {
              res.json({ message: "အခြားမှတ်ပုံတင်ရွေးချယ်ပါ" });
            }
          });
        } else {
          res.json({ message: "အခြားဖုန်းနံပါတ်ရွေးချယ်ပါ" });
        }
      });
    } else {
      res.json({ message: "အခြားနာမည်တစ်ခုရွေးချယ်ပါ" });
    }
  });
});
//------------------------------------------------
export const sendToken = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { name, password } = req.body.data;
  const sql =
    "select Password,Role,AnalystId,Name from price_analyst where Name=?";
  const values = [name];
  connection.query(sql, values, function (err, result) {
    if (err) {
      console.error("Error retrieving data:", err);
    } else {
      if (result[0] != null) {
        // console.log("result", result);
        const storedHash = result[0].Password;
        const role = result[0].Role;
        const id = result[0].AnalystId;

        bcrypt.compare(password, storedHash, (err, result) => {
          if (result) {
            //res.send(role)

            console.log(
              "Message from registerController : password is correct"
            );
            const token = jwt.sign(
              { AnalystName: name, id: id, role: role },
              process.env.ACCESS_TOKEN_SECRET
            );
            //set cookie in client machine
            res.cookie("analystToken", token, {
              httpOnly: true,
              sameSite: "strict",
            });
            res.json({ role: role });
          } else {
            res.json({ message: "မှားယွင်းနေပါသည်" });
            console.log("incorrect password");
          }
        });
      } else {
        res.json({ message: "အကောင့်မရှိပါ" });
        console.log("user does not exist");
      }
    }
  });
});
//--------------------------------------------
export const retrieveRainfedPaddyInfo = asyncHandler(async (req, res) => {
  // console.log("starting working getting reainfed paddy information");

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const getInformation = async () => {
    const combinedResult = {
      cropInfo: [],
      WageInfo: [],
      ChemicalInfo: [],
    };
    const queryCropInformation = "select * from crop where CropId=?";
    const queryWageInformation = "select * from wage where CropId=?";
    const queryChemicalInfo = "select * from chemical where CropId=?";

    try {
      const cropResult = await queryDatabase(queryCropInformation, [1]);
      if (cropResult[0]) {
        combinedResult.cropInfo = cropResult[0];
        const wageResult = await queryDatabase(queryWageInformation, [1]);
        if (wageResult) {
          combinedResult.WageInfo = wageResult;
          const chemicalResult = await queryDatabase(queryChemicalInfo, [1]);
          if (chemicalResult) {
            combinedResult.ChemicalInfo = chemicalResult;
            // console.log("from priceAnalystController: ", combinedResult);
          }
        }
      }
      return combinedResult;
    } catch (err) {
      console.error(err);
    }
  };

  try {
    const result = await getInformation();
    if (result) {
      res.send(result);
    }
  } catch (err) {
    console.error(err);
  }
});
//--------------------------------------------
export const updateChemicalPrice = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { CropId, ChemCategory, Brand, Price } = req.body.chemicalUpdateValue;
  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const updatePrice =
    "update chemical set Price=? where CropId=? and ChemCategory=? and Brand=?";

  Promise.resolve(
    queryDatabase(updatePrice, [Price, CropId, ChemCategory, Brand])
  ).then((result) => {
    if (result) {
      res.send({ status: true });
    }
  });
});
//------------------------------------------------
export const updateLaborWage = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { cropid, laborWage } = req.body;

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
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
      tranplanting: 8,
      seeding: 9,
      foliar_fertilizer: 10,
    };
    return jobIdMap[category];
  };

  const updateJobDetails = async (cropid, laborWage) => {
    const jobCategories = [
      "pesticide",
      "herbicide",
      "fertilizer",
      "harvesting",
      "irrigation",
      "fungicide",
      "plowing",
      "tranplanting",
      "seeding",
      "foliar_fertilizer",
    ];

    for (const category of jobCategories) {
      if (laborWage[category]) {
        const values = [
          laborWage[category].wagePerLabor,
          laborWage[category].jobFrequentUsage,
          cropid,
          getJobIdByCategory(category),
        ];

        const sql = `
          update wage set Wage=?,FrequentUsage=? where CropId=? and JobId=?`;

        try {
          const queryResult = await queryDatabase(sql, values);
          // console.log("update lines", values);

          // console.log("updated rows for wage:", category);
        } catch (err) {
          console.error("Error inserting job details:", err);
        }
      }
    }
    return { status: true };
  };

  try {
    const result = await updateJobDetails(cropid, laborWage);
    if (result) {
      // console.log(result);
      res.send(result.status);
    }
  } catch (error) {
    console.error(error);
  }
});
//---------------------------------------------------
export const updateMachineryCost = asyncHandler(async (req, res) => {
  const { cropid, machineryCost } = req.body;

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
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
      tranplanting: 8,
      seeding: 9,
      foliar_fertilizer: 10,
    };
    return jobIdMap[category];
  };

  const updateJobDetails = async (cropid, machineryCost) => {
    const jobCategories = [
      "pesticide",
      "herbicide",
      "fertilizer",
      "harvesting",
      "irrigation",
      "fungicide",
      "plowing",
      "tranplanting",
      "seeding",
      "foliar_fertilizer",
    ];

    for (const category of jobCategories) {
      if (machineryCost[category]) {
        const values = [
          machineryCost[category],
          cropid,
          getJobIdByCategory(category),
        ];

        const sql = `
          update wage set Wage=? where CropId=? and JobId=?`;

        try {
          const queryResult = await queryDatabase(sql, values);
          // console.log("update lines", values);

          // console.log("updated rows for wage:", category);
        } catch (err) {
          console.error("Error inserting job details:", err);
        }
      }
    }
    return { status: true };
  };

  try {
    const result = await updateJobDetails(cropid, machineryCost);
    if (result) {
      // console.log(result);
      res.send(result.status);
    }
  } catch (error) {
    console.error(error);
  }
});
