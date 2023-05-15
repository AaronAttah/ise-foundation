const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

const generateUserToken = (user) => {
  console.log(user.DATA._id)
  return jwt.sign(
    {
      _id: user.DATA._id, 
      email: user.DATA.email, 
      first_name: user.DATA.first_name, 
      last_name: user.DATA.last_name,
      phone: user.DATA.phone,   
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

module.exports = { generateUserToken };

