import mongoose from 'mongoose';
const postSchema=mongoose.Schema({
  title:String,
  description:{type:String,required:true},
  user:{type:mongoose.Types.ObjectId, ref:'user'},
  postImg:String,
  like:[{
    type:mongoose.Types.ObjectId ,
    ref:"user"
  }],
  comment:[{
    description:{type:String,required:true},
    user:{type:mongoose.Types.ObjectId, ref:'user'},
    commentImg:String,
  }]
  
},{
  timestamps:true
})
export const postModel=mongoose.model('post',postSchema);