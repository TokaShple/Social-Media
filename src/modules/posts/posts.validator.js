import Joi from "joi";
//1-CREATE VALIDATION
export const createPostSchema=Joi.object({
  title:Joi.string().min(2).max(50),
  description:Joi.string().min(2).max(3000).required()
});
//2-GET BY ID Validation
export const getPostByIdSchema=Joi.object({
  id:Joi.string().hex().length(24).required()
})
//3-UPDATE 
export const updatePostByIdSchema=Joi.object({
  title:Joi.string().min(2).max(50),
  description:Joi.string().min(2).max(3000),
  id:Joi.string().hex().length(24).required()
})
//3-DELETE
export const deletePostByIdSchema=Joi.object({
  id:Joi.string().hex().length(24).required()
})