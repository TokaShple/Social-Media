import express from "express";
import * as commentController from "./comments.controllers.js";
import { protectRoutes } from "../auth/auth.controllers.js";
const commentRouter=express.Router();
commentRouter.route("/:id")
  .post(protectRoutes,commentController.createComment);
commentRouter.route("/:postId/:commentId")
  .put(protectRoutes,commentController.updateComment)
  .delete(protectRoutes,commentController.deleteComment);
commentRouter.route("/:postId")
  .get(protectRoutes,commentController.getAllComments);
export default commentRouter;