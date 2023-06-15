import joi from 'joi';
//1-SIGNUP VALIDATION
export const signupSchema=joi.object({
    name:joi.string().min(2).max(30).required(),
    email:joi.string().min(2).max(30).required().pattern(new RegExp('^[a-zA-Z]{2,}@(gmail).com$')),
    password:joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    phone:joi.string().required().pattern(new RegExp('^01[0125][0-9]{8}$')),
    age:joi.number().required()
});
//2-SIGNIN Validation
export const signinSchema=joi.object({
    email:joi.string().min(2).max(30).required().pattern(new RegExp('^[a-zA-Z0-9]{2,}@(yahoo/gmail).com$')),
    password:joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
});
