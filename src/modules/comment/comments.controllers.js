import catchAsyncError from "../../utlis/middleware/catchAsyncError.js";
import AppError from "../../utlis/services/AppError.js";
import { postModel } from "../../../database/models/post.model.js";
import { userModel } from "../../../database/models/user.model.js";
import mongoose from "mongoose";

// CREATE COMMENT
export const createComment = catchAsyncError(async (req, res, next) => {
  try {
    const postId =new mongoose.Types.ObjectId(req.params.id);
    const post = await postModel.findById(postId);
    if (!post) {
      return next(new AppError("POST NOT FOUND!!!!!", 404));
    } else {
      const user = await userModel.findById(req.userId);
      const comment = {
        description: req.body.description,
        user: req.userId,
        commentImg: req.body.commentImg,
      };
      post.comment.push(comment);
      let savePost=await post.save();
      !savePost && next(new AppError('ERROR IN COMMENT SAVE IN POST!!!!',401));
      savePost && res.status(201).json({ message: "COMMENT CREATED......", savePost });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "ERROR!!!!!", err });
  }
});

// UPDATE COMMENT
export const updateComment = catchAsyncError(async (req, res, next) => {
  try {
    const postId =new mongoose.Types.ObjectId(req.params.postId);
    console.log(postId);
    const post = await postModel.findById(postId);
    if (!post) {
      return next(new AppError("POST NOT FOUND!!!!!", 404));
    } else {
      const commentId =new mongoose.Types.ObjectId(req.params.commentId); // Convert the commentId parameter to a valid ObjectId
      console.log(commentId);
      const commentIndex = post.comment.findIndex(
        (comment) => comment._id.toString() === commentId.toString()
      );
      if (commentIndex === -1) {
        return next(new AppError("COMMENT NOT FOUND!!!!!", 404));
      } else {
        const user = await userModel.findById(req.userId);
        const updatedComment = {
          description: req.body.description,
          user: req.userId,
          commentImg: req.body.commentImg,
        };
        post.comment[commentIndex] = updatedComment;
        const savedPost = await post.save();
        res.status(200).json({ message: "COMMENT UPDATED......", savedPost });
      }
    }
  }catch (err) {
    console.log(err);
    res.status(500).json({ message: "ERROR!!!!!", err });
  }
});

// DELETE COMMENT
export const deleteComment = catchAsyncError(async (req, res, next) => {
  try {
    const postId =new mongoose.Types.ObjectId(req.params.postId); // Convert the postId parameter to a valid ObjectId
    const post = await postModel.findById(postId);
    if (!post) {
      return next(new AppError("POST NOT FOUND!!!!!", 404));
    } else {
      const commentId =new mongoose.Types.ObjectId(req.params.commentId); // Convert the commentId parameter to a valid ObjectId
      const commentIndex = post.comment.findIndex(
        (comment) => comment._id.toString() === commentId.toString()
      );
      if (commentIndex === -1) {
        return next(new AppError("COMMENT NOT FOUND!!!!!", 404));
      } else {
        post.comment.splice(commentIndex, 1);
        const savedPost = await post.save();
        res.status(200).json({ message: "COMMENT DELETED......", savedPost });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "ERROR!!!!!", err });
  }
});

// GET ALL COMMENTS FOR A POST
export const getAllComments = catchAsyncError(async (req, res, next) => {
  try {
    const postId =new mongoose.Types.ObjectId(req.params.postId); // Convert the postId parameter to a valid ObjectId
    const post = await postModel.findById(postId).populate({
      path: "comment.user",
      select: "name email",
    });
    if (!post) {
      return next(new AppError("POST NOT FOUND!!!!!", 404));
    } else {
      res.status(200).json({ message: "ALL COMMENTS......", post });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "ERROR!!!!!", err });
  }
});