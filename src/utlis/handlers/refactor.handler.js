import catchAsyncError from "../middleware/catchAsyncError.js";
import AppError from "../services/AppError.js";

const deleteOne=(model)=>{
  return catchAsyncError(async(req,res,next)=>{
    let {id}=req.params;
    let results=await model.findByIdAndDelete(id);
    !results && next(new AppError("not found!!!!",404));
    results && res.status(200).json({message:"DELETED SUCCESSFULY....",results});
  }
)}

export default deleteOne;