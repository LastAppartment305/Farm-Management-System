import asyncHandler from 'express-async-handler';

export const testRoute=asyncHandler(async(req,res)=>{
    res.send("This is testing route and controllers");
})

