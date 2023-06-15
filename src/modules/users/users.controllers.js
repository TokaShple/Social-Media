import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import catchAsyncError from "../../utlis/middleware/catchAsyncError.js";
import { userModel } from "../../../database/models/user.model.js";
import AppError from "../../utlis/services/AppError.js"; 
import mongoose from "mongoose";
import deleteOne from "../../utlis/handlers/refactor.handler.js";
import { emailFunction } from "../../utlis/middleware/sendEmail.js"
const { Jwt } = jwt;
//               1-SIGNUP
export const signUp=catchAsyncError(async(req,res,next)=>{
  try{
    let isFound=await userModel.findOne({email:req.body.email});
    if(isFound){
      next(new AppError("EMAIL ALREADY EXIST",409));
    }else{
      req.body.profilePic=req.file.filename;
      let user=new userModel(req.body);
      let saveUser=await user.save();
      const token=jwt.sign({email:saveUser.email,id:saveUser._id},process.env.JWT_key);
      const link=`${req.protocol}://${req.headers.host}/api/v1/users/user/confirmEmail/${token}`;
      let{email}=req.body;
      emailFunction(email,"email Confirmation",`<a href='${link}'>email confirmation</a>`);
      saveUser && res.status(201).json({message:"USER SIGNED UP.........",saveUser});
      !saveUser && next (new AppError("USER NOT SAVED!!!!!!",400));
    }
  }catch(err){
    console.log(err);
    res.status(401).json({message:"ERROR!!!!",err});
  }
})
//                   2-CONFIRMEMAIL
export const confirmEmail=catchAsyncError( async(req,res,next)=>{
  try{
    const {token}=req.params;
    if(!token){
      return res.status(400).json({message:"invalid token!!!!"});
    }
    const decoded=jwt.verify(token,process.env.JWT_key);
    const user=await userModel.findByIdAndUpdate({_id:decoded.id},{verified:true},{new:true});
    if(user){
      res.status(201).json({message:"EMAIL CONFIRMED....."});
    }else{
      next (new AppError("FAIL IN EMAIL CONFIRMATION!!!!",400));
    }
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!",err});
  }
})
//               3-SIGNIN
export const signIn=catchAsyncError(async(req,res,next)=>{
  try{
    const{email,password}=req.body;
    let isFound=await userModel.findOne({email});
    const match=await bcrypt.compareSync(password,isFound.password);
    if(isFound&&match){
      let token=jwt.sign({name:isFound.name,
                    userId:isFound._id,
                    role:isFound.role},process.env.JWT_key);
      return res.status(200).json({message:"LOGIN SUCCESS...",token});
    }else{
      next(new AppError("INCORRECT EMAIL OR PASSWORD!!!!",401));
    }
  }catch(err){
    console.log(err);
    res.status(401).json({message:"EROR!!!!",err});
  }
})
//                  4-DELETE By Id
export const deleteUserById=deleteOne(userModel);
//                  5-CHANGE PASSWORD
export const changePassword = catchAsyncError(async (req, res, next) => {
  const {userId}=req.userId;
  const { password } = req.body;
  const salt = bcrypt.genSaltSync(7);
  const hashedPassword = bcrypt.hashSync(password, salt);
  req.body.changePasswordAt = Date.now();
  const updatedUser = await userModel.findOneAndUpdate(
    { userId },
    { password: hashedPassword },
    { new: true }
  );
  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }
  res.status(200).json({ message: "Password updated successfully", user: updatedUser });
});
//                        6-LOGOUT
export const logout =async(req,res,next)=>{
  try{
    const {userId}=req.userId;
    const userOut=await userModel.findOneAndUpdate({userId,isActive:true},{isActive:false,lastSeen:Date.now()});
    if(userOut){
      res.status(200).json({message:"USER LOGGED OUT......"});
    }else{
      res.status(400).json({message:"FALI IN LOGOUT!!!!!!!!!!"});
    }
  }catch(err){
    console.log(err);
    res.status(401).json({message:"EROR!!!!",err});
  }
}
