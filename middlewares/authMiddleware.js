const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const StatusCodes = require("../utils/status-codes");




const authMiddleware = (req, res, next) => {

  try {
      const token = req.headers.authorization.split(" ")[1];

      if (!token) return res.status().json({
          status: 'failed',
          error: 'Access Denied '
      });

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      
      next();
  } catch (error) {
  
   res.status(StatusCodes.UNAUTHORIZED).json({
          status: 'failed',
          error: 'Session Ended Please Login.'
      })
      
      
  }
}




// const authMiddleware = asyncHandler(async (req, res, next) => {
//   let token;
//   if (req?.headers?.authorization?.startsWith("Bearer")) {
//     token = req.headers.authorization.split(" ")[1];
//     try {
//       if (token) {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded?.id);
//         req.user = user;
//         next();
//       }
//     } catch (error) {
//       res.status(StatusCodes.UNAUTHORIZED);
//       throw new Error("Not Authorized token expired, Please Login again");
//     }
//   } else {
//     res.status(StatusCodes.UNAUTHORIZED)
//     throw new Error(`Access Denied`); //There is no token attached to header
//   }
//   redirect(301,'/login');
// });


/*
 * check in admins via their roles
 */
const isAdmin = asyncHandler(async (req, res, next) => {
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.role !== "admin") {
    res.status()
    throw new Error("You are not an admin");
  } else {
    next();
  }
});

module.exports = { authMiddleware };
