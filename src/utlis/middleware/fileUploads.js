import multer from "multer";
import AppError from "../services/AppError.js";
///////////////////////FOR SINGLE FILE
export const uploadSingleFile=(folderName,fieldName)=>{
  //MULTER 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `uploads/${folderName}`)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + "-"+file.originalname)
  },
});
function fileFilter (req, file, cb) {
  if(file.mimetype.startsWith('image')){
    cb(null, true)
  }else{
    cb(new AppError("Invalid Image",400), true)
  }
}
const upload = multer({ storage,fileFilter })

return upload.single(fieldName);
}
///////////////////////FOR MULTIPLE FILES
export const uploadMixFiles=(folderName,arrayFields)=>{
  //MULTER 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `uploads/${folderName}`)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + "-"+file.originalname)
  },
});
function fileFilter (req, file, cb) {
  if(file.mimetype.startsWith('image')){
    cb(null, true)
  }else{
    cb(new AppError("Invalid Image",400), true)
  }
}
const upload = multer({ storage,fileFilter })

return upload.fields(arrayFields);
}
