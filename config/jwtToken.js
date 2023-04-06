const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

const generateUserToken = (user) => {
  return jwt.sign(
    {
      _id: user._id, 
      email: user.email, 
      first_name: user.first_name, 
      last_name: user.last_name,
      phone: user.phone,   
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

module.exports = { generateUserToken };

