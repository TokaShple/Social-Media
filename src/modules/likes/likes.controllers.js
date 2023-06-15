import { userModel } from "../../../database/models/user.model.js";
import { postModel } from "../../../database/models/post.model.js";
import catchAsyncError from "../../utlis/middleware/catchAsyncError.js";
import AppError from "../../utlis/services/AppError.js";
import mongoose from "mongoose";
//CRUD
const addLike = catchAsyncError(async (req, res, next) => {
  try {
    const postId =new mongoose.Types.ObjectId(req.params._id);
    const post = await postModel.findById(postId);
    if (!post) {
      return next(new AppError('POST NOT FOUND!!!!!', 404));
    } else {
      const isLiked = post.like.includes(req.userId);
      if (isLiked) {
        return next(new AppError('ALREADY LIKED!!!!!', 400));
      } else {
        post.like.push(req.userId);
        await post.save();
        res.status(200).json({ message: 'POST LIKED SUCCESSFULLY......' });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'ERROR!!!!!', err });
  }
});

const removeLike = catchAsyncError(async (req, res, next) => {
  try {
    const postId =new mongoose.Types.ObjectId(req.params._id); // Convert the _id parameter to a valid ObjectId
    const post = await postModel.findById(postId);
    if (!post) {
      return next(new AppError('POST NOT FOUND!!!!!', 404));
    } else {
      const isLiked = post.like.includes(req.userId);
      if (!isLiked) {
        return next(new AppError('YOU HAVE NOT LIKED THIS POST!!!!!', 400));
      } else {
        post.like = post.like.filter(
          (like) => like.toString() !== req.userId.toString()
        );
        await post.save();
        res.status(200).json({ message: 'LIKE REMOVED SUCCESSFULLY......' });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'ERROR!!!!!', err });
  }
});
//////   3-GET ALL
const getAllLikes=catchAsyncError(async(req,res,next)=>{
  try{
    const postId =new mongoose.Types.ObjectId(req.params._id); // Convert the _id parameter to a valid ObjectId
    let like=await postModel.findById(postId).select("like");
    !like && next(new AppError("NO LIKES YET!!!!!",404));
    like && res.status(200).json({message:"DONE....",like});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"ERROR!!!!!",err});
  }
})
export{
  addLike,
  removeLike,
  getAllLikes
};
