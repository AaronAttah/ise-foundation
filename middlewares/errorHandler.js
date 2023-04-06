// not Found for unknown URL/endpoints

const notFound = (req, res, next) => {
  // 
    const error = new Error(`Not Found. : ${req.originalUrl}`);
    console.log(error)
    res.status(409);
    next(error);
  };
  
  
            // error handler: handles error properly and spils it out: so for instance it will catch the "not found" error  above and other subsequent errors then logs it out
  const errorHandler = (err, req, res, next) => {
    const statuscode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statuscode);
    console.log({
      status:'Failed....',
      message:err.message
    })
  
    res.status(statuscode).json({
        status:'Failed..',
        message: err?.message,
      // stack: err?.stack,
    });
  };


  
  module.exports = { errorHandler, notFound }; 
  