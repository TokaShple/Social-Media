const globalError = (err,req,res,next)=>{
    console.log(err);
    const status = err.status || 500;
    res.status(status);
    //res.status(err.statusCode).json({message:err.message}) || 500;
};
export default globalError;