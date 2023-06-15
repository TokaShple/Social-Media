import { postModel } from "../../../database/models/post.model.js";
import { userModel } from "../../../database/models/user.model.js";
import catchAsyncError from "../../utlis/middleware/catchAsyncError.js";
import AppError from "../../utlis/services/AppError.js";
import deleteOne from "../../utlis/handlers/refactor.handler.js";
import ApiFeatures from "../../utlis/services/APIFeatures.js";
import mongoose from "mongoose";
//CRUD
//////   1-CREATE
const createPost =catchAsyncError(async(req,res,next)=>{
  try{
    let user=await userModel.findById(req.userId).select('_id');
    if(!user){
      return next(new AppError("USER NOT FOUND!!!!!",404));
    }else{
      const{title,description}=req.body;
      let post= new postModel({title,description,user});
      let savePost= await post.save();
      if(!savePost){
        next (new AppError("POST NOT SAVED!!!!!!",400));
      }else{
        let saveUsersPost= await userModel.findByIdAndUpdate(req.userId,{$addToSet:{post:savePost}},{new:true});
        res.status(201).json({message:"POST ADDED..........",savePost});
      }
    }
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!!",err});
  }
})
//////   2-READ(GET ALL)
const getallPost=catchAsyncError(async(req,res,next)=>{
  try{
    let apiFeatures=new ApiFeatures(postModel.find(),req.query).pagination().fields().sort().search();
    let post=await apiFeatures.mongooseQuery ;
    !post && next (new AppError("Not Found!!!!",404));
    post && res.status(200).json({message:"DONE...",page:apiFeatures.page,post});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   2.1-READ BY ID
const getPostById=catchAsyncError (async(req,res,next)=>{
  try{
    let {id}=req.params;
    let post=await postModel.findById(id);
    !post && next (new AppError("Not Found!!!!",404));
    post && res.status(200).json({message:"DONE...",post});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   3-UPDATE BY Id
const updatePostById=catchAsyncError (async(req,res,next)=>{
  try{
    let {id}=req.params;
    let post=await postModel.findById(id);
    if(!post){
      return next(new AppError("POST NOT FOUND!!!",400))
    }else{
      /*console.log(`post.user: ${post.user}`);
      console.log(`req.userId: ${req.userId}`);*/
      if (post.user.toString() !== new mongoose.Types.ObjectId(req.userId).toString()) {
        return next(new AppError("You are not authorized to update this post.", 401));
      } else{
        let {title,description}=req.body;
        let post=await postModel.findByIdAndUpdate(id,{description,title},{new:true});
        !post && next (new AppError("Not Found!!!!",404));
        post && res.status(200).json({message:"DONE...",post});
      }
    }
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
//////   4-DELETE By Id
const deletePostById=catchAsyncError(async(req,res,next)=>{
  try{
    let {id}=req.params;
    let post=await postModel.findById(id);
    if(!post){
      return next(new AppError("POST NOT FOUND!!!",400))
    }else{
      /*console.log(`post.user: ${post.user}`);
      console.log(`req.userId: ${req.userId}`);*/
      if (post.user.toString() !== new mongoose.Types.ObjectId(req.userId).toString()) {
        return next(new AppError("You are not authorized to delete this post.", 401));
      } else{
        let post=await postModel.findByIdAndRemove(id);
        !post && next (new AppError("Not Found!!!!",404));
        post && res.status(200).json({message:"DONE POST DELETED SUCCESSFULLY..."});
      }
    }
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!",err});
  }
})
export{
  createPost,
  getallPost,
  getPostById,
  updatePostById,
  deletePostById
};