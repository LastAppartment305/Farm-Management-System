import asyncHandler from "express-async-handler";
export const getOverallData = asyncHandler(async (req, res) => {
  console.log(req.body);
});
