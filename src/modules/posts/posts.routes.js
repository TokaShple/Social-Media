import { Router } from "express";
import * as postController from './posts.controllers.js'
import { validation } from "../../utlis/middleware/validation.js";
import {createPostSchema,updatePostByIdSchema,deletePostByIdSchema,getPostByIdSchema } from "./posts.validator.js";
import { protectRoutes } from "../auth/auth.controllers.js";
const postRouter=Router();
postRouter.route("/")
  .get(protectRoutes,postController.getallPost)
  .post(/*uploadMixFiles('post','postImg'),*/protectRoutes,validation(createPostSchema),postController.createPost);
postRouter.route("/:id")
  .get(validation(getPostByIdSchema),postController.getPostById)
  .put(/*uploadMixFiles('post','postImg'),*/protectRoutes,validation(updatePostByIdSchema),postController.updatePostById)
  .delete(protectRoutes,validation(deletePostByIdSchema),postController.deletePostById);

export default postRouter;