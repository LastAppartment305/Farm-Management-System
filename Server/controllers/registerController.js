import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import { connection } from "../index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//put new user information into database
export const registerController = asyncHandler(async (req, res) => {
  const { name, phone, password, NRC, Address, Age, userRole } = req.body;

  const isoDate = new Date();
  const mySQLDateString = isoDate.toJSON().slice(0, 19).replace("T", " ");

  //hashing with bcrypt
  const storePassword = async (plainPassword) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
    return hashedPassword;
  };

  const encodedPassword = await storePassword(password);
  const sql =
    "INSERT INTO user (Name, Phone_no, User_role, Created_at, Password,NRC,Address,Age) VALUES (?,?,?,?,?,?,?,?)";
  const checkPhoneNo = "select Phone_no from user where Phone_no=?";
  const checkName = "select Name from user where Name=?";
  const checkPassword = "select Password from user where Password=?";

  const values = [
    name,
    phone,
    userRole,
    mySQLDateString,
    encodedPassword,
    NRC,
    Address,
    Age,
  ];
  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  Promise.resolve(queryDatabase(checkName, [name])).then((result) => {
    console.log(result);
    if (!result[0]) {
      return queryDatabase(checkPhoneNo, [phone]).then((phoneResult) => {
        if (!phoneResult[0]) {
          connection.query(sql, values, function (err, result) {
            if (err) {
              console.error("Error inserting data:", err);
              res
                .status(500)
                .json({ error: "An error occurred while inserting data" });
            } else {
              console.log("Data inserted successfully!");
              res.json({ message: "Data inserted successfully" });
            }
          });
        } else {
          res.json(phoneResult);
        }
      });
    } else {
      res.json(result);
    }
  });
});

//retrieve data and compare necessary checks at login
export const loginCheck = asyncHandler(async (req, res) => {
  const { password, name } = req.body;
  //console.log(receiveData);
  const sql = "select Password,User_role,UserId from user where Name=?";
  const values = [name];
  connection.query(sql, values, function (err, result) {
    if (err) {
      console.error("Error retrieving data:", err);
    } else {
      if (result[0] != null) {
        const storedHash = result[0].Password;
        const role = result[0].User_role;
        const id = result[0].UserId;

        bcrypt.compare(password, storedHash, (err, result) => {
          if (err) throw err;
          if (result) {
            //res.send(role)

            console.log(
              "Message from registerController : password is correct"
            );
            const token = jwt.sign(
              { username: name, role: role, id: id },
              process.env.ACCESS_TOKEN_SECRET
            );
            //set cookie in client machine
            res.cookie("authToken", token, {
              httpOnly: true,
              sameSite: "strict",
            });
            res.send(role);
          } else {
            res.send("");
            console.log("incorrect password");
          }
        });
      } else {
        res.send("");
        console.log("user does not exist");
      }
    }
  });
});
//--------------------------------------------
export const getUserInformation = asyncHandler(async (req, res) => {
  const getUser = "select * from user where Name=?";
  const values = [req.body.name];
  console.log(req.body);

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  Promise.resolve(
    queryDatabase(getUser, values).then((result) => {
      console.log(result);
      res.json({ data: result[0] });
    })
  );
  // console.log("This is username : ", values);
});
//--------------------------------------------------------------
export const editUserInformation = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, phone, oldPhone } = req.body;
  const modifyUserData = "update user set Name=?,Phone_no=? where Phone_no=?";
  const values = [name, phone, oldPhone];

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };

  Promise.resolve(
    queryDatabase(modifyUserData, values).then((result) => {
      if (result) {
        res.send({ status: true });
      }
    })
  );
});
//--------------------------------------------------
export const getPosts = asyncHandler(async (req, res) => {
  const { id } = req.user;
  console.log("userId", id);

  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };
  const retrievePosts = async () => {
    const sql = "select * from post_general_info where UserId=?";
    try {
      const postLists = await queryDatabase(sql, [id]);
      if (postLists) {
        // console.log("post for specific owner", postLists);
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
//---------------------------------------------------
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

  const getGeneralInfo = "select * from post_general_info where PostId=?";
  const getJobInfo = "select * from post_job_info where PostId=?";
  const getTotalCost = "select * from post_total_cost where PostId=?";
  // console.log("specific post id", postid);
  const getPostDetails = async (id) => {
    try {
      let combinedResult = {
        username: req.user.username,
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
  res.send(result);
});
//-------------------------------------------------
export const getAllPost = asyncHandler(async (req, res) => {
  // console.log("post for admin work");
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
        // console.log("post for admin", postLists);
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
//--------------------------------------------------
export const approvePost = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { postid } = req.body;
  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };
  const sql = "update post_general_info set ApproveStatus=? where PostId=?";
  const updatePostStatus = async () => {
    try {
      const updateResult = await queryDatabase(sql, [true, postid]);
      if (updateResult) {
        // console.log("post for admin", postLists);
        res.send(updateResult);
      }
    } catch (err) {
      console.error("Error at updating posts", err);
    }
  };
  try {
    await updatePostStatus();
  } catch (err) {
    console.error("Error at retrieving posts");
  }
});
//----------------------------------------------
export const unapprovePost = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { postid } = req.body;
  const queryDatabase = (sql, value) => {
    return new Promise((resolve, reject) => {
      connection.query(sql, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  };
  const sql = "update post_general_info set ApproveStatus=? where PostId=?";
  const updatePostStatus = async () => {
    try {
      const updateResult = await queryDatabase(sql, [false, postid]);
      if (updateResult) {
        // console.log("post for admin", postLists);
        res.send(updateResult);
      }
    } catch (err) {
      console.error("Error at updating posts", err);
    }
  };
  try {
    await updatePostStatus();
  } catch (err) {
    console.error("Error at retrieving posts");
  }
});
