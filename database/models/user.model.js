import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema=mongoose.Schema({
  name:{
    type:String,
    unique:[true,"name is required!!!!!"],
    trim:true,
    required:true,
    minLength:[2,"too short category name!!!!!!"]
  },
  email:{
    type:String,
    unique:[true,"email is required!!!!!"],
    trim:true,
    required:true,
    minLength:[2,"too short category name!!!!!!"]
  },
  password:{
    type:String,
    required:true,
    minLength:[6,"minlength 6 characters!!!!!"]
  },
  phone:{
    type:String,
    required:[true,"phone number required!!!!!"]
  },
  changePasswordAt:{
    type:Date
  },
  profilePic:String,
  isActive:{
    type:Boolean,
    default:true
  },
  verified:{
    type:Boolean,
    default:false
  },
  age:Number,
  post:[{
    type:mongoose.SchemaTypes.ObjectId ,
    ref:"post"
  }]
},{
  timestamps:true
})

userSchema.pre('save', function (next) {
  try {
    const salt = bcrypt.genSaltSync(7);
    const hashedPassword = bcrypt.hashSync(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.post('findOneAndUpdate', function (doc, next) {
  try {
    if (doc && doc._update && doc._update.password) {
      const salt = bcrypt.genSaltSync(7);
      const hashedPassword = bcrypt.hashSync(doc._update.password, salt);
      doc._update.password = hashedPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
});
export const userModel=mongoose.model("user",userSchema);