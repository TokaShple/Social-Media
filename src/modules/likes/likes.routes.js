import express from "express";
import * as likeController from "./likes.controllers.js";
import { protectRoutes } from "../auth/auth.controllers.js";
const likeRouter=express.Router();
likeRouter.patch("/addLike/:_id",protectRoutes,likeController.addLike);
likeRouter.delete("/removeLike/:_id",protectRoutes,likeController.removeLike);
likeRouter.get("/getAllLikes/:_id",protectRoutes,likeController.getAllLikes);
export default likeRouter;