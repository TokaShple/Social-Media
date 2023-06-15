import express from "express";
import * as userController from "./users.controllers.js";
import { protectRoutes } from "../auth/auth.controllers.js";
import { uploadSingleFile } from "../../utlis/middleware/fileUploads.js";
const userRouter=express.Router();
userRouter.post("/signup",uploadSingleFile('user','profilePic'),userController.signUp);
userRouter.post("/signin",userController.signIn);
userRouter.get("/logout",protectRoutes,userController.logout);
userRouter.get('/user/confirmEmail/:token',userController.confirmEmail);
userRouter.route("/")
  .delete(protectRoutes,userController.deleteUserById)
  .patch(protectRoutes,userController.changePassword);
export default userRouter;