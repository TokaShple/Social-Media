import jwt from "jsonwebtoken";
import catchAsyncError from "../../utlis/middleware/catchAsyncError.js";
import { userModel } from "../../../database/models/user.model.js";
import AppError from "../../utlis/services/AppError.js"; 
import mongoose from "mongoose";
const { Jwt } = jwt;
//                      AUTHENTICATION
export const protectRoutes=catchAsyncError(async(req,res,next)=>{
  try{
    let{token}=req.headers;
    if(!token)return next(new  AppError("PLEASE PROVIDE TOKEN!!",401));

    let decoded=await jwt.verify(token,process.env.JWT_key);
    //console.log(decoded)
    let user=await userModel.findById(decoded.userId);
    if(!user)return next(new AppError("invalid user ",401));

    let changePasswordDate;
    if (user.changePasswordAt) {
      changePasswordDate = parseInt(user.changePasswordAt.getTime() / 1000);
      if(changePasswordDate>decoded.iat) return next(new AppError("Invalid TOKEN!!!!",401));
    } else { 
    req.userId=user._id;
    next();
  }
  }catch(err){
    console.log(err);
    res.status(401).json({message:"ERROR!!!!",err});
  }
})
