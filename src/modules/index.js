import AppError from "../utlis/services/AppError.js";
import userRouter from "./users/users.routes.js";
import globalError from "../utlis/middleware/globalErrorHandle.js";
import express from "express";
import postRouter from "./posts/posts.routes.js";
import likeRouter from "./likes/likes.routes.js";
import commentRouter from "./comment/comments.routes.js";
export function init(app){
  app.use("/api/v1/users",userRouter);
  app.use("/api/v1/posts",postRouter);
  app.use("/api/v1/likes",likeRouter);
  app.use("/api/v1/comments",commentRouter);
  app.get('/favicon.ico', (req,res) => res.status(204));
  app.use(express.static('uploads'));
  app.all('*',(req,res,next)=>{
      next (new AppError(`Can't find this route: ${req.originalUrl}`,404));
  })
  app.use(globalError);
}
