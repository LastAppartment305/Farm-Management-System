import { connection } from "../index.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
//import { auth } from '../../client/firebase.config.js';
//import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
dotenv.config();

export const sendWorkerToken = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  console.log(req.body);
  const getPassword = "select * from worker where Name=?";

  const value = [name];

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  Promise.resolve(queryDatabase(getPassword, value))
    .then((result) => {
      console.log(result);
      if (result[0] != null) {
        const storedHash = result[0].Password;
        const name = result[0].Name;
        const id = result[0].WorkerId;
        bcrypt.compare(password, storedHash, (err, result) => {
          if (err) throw err;
          if (result) {
            //res.send(role)

            console.log(
              "Message from registerController : password is correct"
            );
            const token = jwt.sign(
              { username: name, id: id },
              process.env.WORKER_TOKEN_SECRET
            );
            //set cookie in client machine
            res.cookie("workerAuth", token, {
              httpOnly: true,
              sameSite: "strict",
            });
            res.send("worker");
          } else {
            res.send("");
            console.log("incorrect password");
          }
        });
      } else {
        res.send(null);
        console.log("user does not exist");
      }
      // if (result[0]) {
      //   if (result[0].FarmId && result[0].WorkerId) {
      //     res.json({
      //       farmid: result[0].FarmId,
      //       workerid: result[0].WorkerId,
      //       userid: result[0].UserId,
      //     });
      //     console.log(result);
      //   } else {
      //     res.json({ farmid: null });
      //   }
      // } else {
      //   res.json({ farmid: null });
      // }
      // try {
      //   res.json({ farmid: result[0].FarmId, workerid: result[0].WorkerId });
      //   console.log(result);
      // } catch (err) {
      //   console.log(err);
      // }
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send({ message: "unexpected error occur at logging in with otp" });
    });
});
//-------------------------------------------------------------
export const sendCookie = asyncHandler(async (req, res) => {
  const { farmid, workerid, userid } = req.body;

  try {
    const token = jwt.sign(
      { farmid: farmid, workerid: workerid, userid: userid },
      process.env.WORKER_TOKEN_SECRET
    );

    res.cookie("workerAuth", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    });
    res.status(200).send({ message: "Cookie set successfully" });
    // console.log(token);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "error at sending token" });
  }
});
//-------------------------------------------------------------
export const createWorker = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, phone, password, NRC, Address, Age } = req.body;

  const storePassword = async (plainPassword) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  };

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };
  const encodedPassword = await storePassword(password);

  const addWorkerToDatabase =
    "insert into worker (Name,Phone_no,Password,NRC,Address,Age) values(?,?,?,?,?,?)";

  Promise.resolve(
    queryDatabase(addWorkerToDatabase, [
      name,
      phone,
      encodedPassword,
      NRC,
      Address,
      Age,
    ])
  ).then((result) => {
    console.log(result);
    res.send(result);
  });
});
//-----------------------------------------------
export const workerLogout = asyncHandler(async (req, res) => {
  console.log("worker logout");
  res.clearCookie("workerAuth");
  res.send(true);
});
//-----------------------------------------------------
export const getPostsForWorker = asyncHandler(async (req, res) => {
  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };
  const retrievePosts = async () => {
    // const sql = "select * from post_general_info";
    const sql =
      "select p.*,u.* from post_general_info p join user u on p.UserId=u.UserId";
    try {
      const postLists = await queryDatabase(sql);
      if (postLists) {
        console.log("post for admin", postLists);
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
//--------------------
export const getSpecificPost = asyncHandler(async (req, res) => {
  const { postid } = req.body;
  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const getGeneralInfo =
    "select p.*,u.Name,u.Phone_no,u.Address,u.NRC,u.Age from post_general_info p join user u on p.UserId=u.UserId where PostId=?";
  const getJobInfo = "select * from post_job_info where PostId=?";
  const getTotalCost = "select * from post_total_cost where PostId=?";
  // console.log("specific post id", postid);
  const getPostDetails = async (id) => {
    try {
      let combinedResult = {
        postGeneralInfo: null,
        postJobInfo: null,
        postTotalCost: null,
      };

      const generalResult = await queryDatabase(getGeneralInfo, [id]);
      if (generalResult[0]) {
        combinedResult.postGeneralInfo = generalResult[0];
        const jobResult = await queryDatabase(getJobInfo, [id]);
        if (jobResult) {
          combinedResult.postJobInfo = jobResult;
          const costResult = await queryDatabase(getTotalCost, [id]);
          if (costResult) {
            combinedResult.postTotalCost = costResult;
            // console.log(combinedResult);
          }
        }
      }
      return combinedResult;
    } catch (error) {
      console.error("Error retrieving data:", error);
      throw error;
    }
  };
  const result = await getPostDetails(postid);
  console.log(result);
  res.send(result);
});
//-----------------------------------------------
export const agreePropose = asyncHandler(async (req, res) => {
  const { postid } = req.body;
  const { id } = req.worker;

  console.log(postid, id);

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const agreementSql = "update post_general_info set WorkerId=? where PostId=?";
  const makeAgreement = async () => {
    try {
      const agreementResult = await queryDatabase(agreementSql, [id, postid]);
      console.log("agreement result: ", agreementResult);
    } catch (err) {
      console.error("Error at making agreement: ", err);
    }
  };

  try {
    await makeAgreement();
  } catch (error) {
    console.error("Error at calling agreement function: ", error);
  }
});
//-----------------------------------------------
export const getAgreedPostsForWorker = asyncHandler(async (req, res) => {
  const { id } = req.worker;

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };
  const retrievePosts = async () => {
    // const sql = "select * from post_general_info";
    let postDetail = {
      postInfo: null,
      OwnerInfo: null,
      workerInfo: null,
    };
    const sql =
      "select p.*,u.UserId,u.Name as UName,u.Phone_no as UPhone,u.Address as UAddress,u.Age as UAge,u.NRC as UNRC,w.WorkerId,w.Name as WName,w.Phone_no as WPhone,w.Address as WAddress,w.Age as WAge,w.NRC as WNRC from post_general_info p join user u on p.UserId=u.UserId join worker w on p.WorkerId=w.WorkerId where p.WorkerId=?";
    try {
      const postLists = await queryDatabase(sql, [id]);
      if (postLists) {
        postDetail.postInfo = console.log("post for admin", postLists);
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
//-------------------------------------------
export const makeContractForm = asyncHandler(async (req, res) => {
  const { postid } = req.body;

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  const getGeneralInfo =
    "select p.*,u.UserId,u.Name as UName,u.Phone_no as UPhone,u.Address as UAddress,u.Age as UAge,u.NRC as UNRC,w.WorkerId,w.Name as WName,w.Phone_no as WPhone,w.Address as WAddress,w.Age as WAge,w.NRC as WNRC from post_general_info p join user u on p.UserId=u.UserId join worker w on p.WorkerId=w.WorkerId where p.PostId=?";
  const getJobInfo = "select * from post_job_info where PostId=?";
  const getTotalCost = "select * from post_total_cost where PostId=?";
  // console.log("specific post id", postid);
  const getPostDetails = async (id) => {
    try {
      let combinedResult = {
        postGeneralInfo: null,
        postJobInfo: null,
        postTotalCost: null,
      };

      const generalResult = await queryDatabase(getGeneralInfo, [postid]);
      if (generalResult[0]) {
        combinedResult.postGeneralInfo = generalResult[0];
        const jobResult = await queryDatabase(getJobInfo, [id]);
        if (jobResult) {
          combinedResult.postJobInfo = jobResult;
          const costResult = await queryDatabase(getTotalCost, [id]);
          if (costResult) {
            combinedResult.postTotalCost = costResult;
            // console.log(combinedResult);
          }
        }
      }
      return combinedResult;
    } catch (error) {
      console.error("Error retrieving data:", error);
      throw error;
    }
  };
  const result = await getPostDetails(postid);
  res.send(result);
});
