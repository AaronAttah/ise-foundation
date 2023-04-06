const mongoose = require("mongoose");
const User = require("../models/user");
const STATUSCODE = require("../utils/status-codes");
const {generateUserToken} = require("../config/jwtToken")

exports.createUser = async (req, res) => {
  const { first_name, last_name, email, phone } = req.body;
  try {
    if(!first_name || !last_name || !email || !phone) 
    return res.status(STATUSCODE.BAD_REQUEST).json({
      status: "failed",
      message: "all fields are required",
    });
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist)
      return res.status(STATUSCODE.BAD_REQUEST).json({
        status: "failed",
        message: "user already exist",
      });

    const user = await User.create({
      first_name,
      last_name,
      email,
      phone,
    });
    return res.status(STATUSCODE.CREATED).json({
      status: "success",
      user,
    });
  } catch (error) {
    return res.status(STATUSCODE.SERVER_ERROR).json({
      status: "failed",
      error: error.message,
    });
  }
};

exports.login = async(req, res) => {
  try{
    const {email} = req.body
    if(!email) 
    return res.status(STATUSCODE.BAD_REQUEST).json({
      status: "failed",
      message: "email is required to have access",
    });

    const user = await User.findOne({ email: req.body.email });
    const token = generateUserToken(user)

    if (user)
      return res.status(STATUSCODE.OK).json({
        status: "success",
        user,
        token
      });
  }catch(error){
    return res.status(STATUSCODE.SERVER_ERROR).json({
      status: "failed",
      error: error.message,
    });
  }
}

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user)
      return res.status(STATUSCODE.NOT_FOUND).json({
        status: "failed",
        message: "user does not exist",
      });

      return res.status(STATUSCODE.OK).json({
        status: "success",
        user
      });;
  } catch (error) {
    return res.status(STATUSCODE.SERVER_ERROR).json({
      status: "failed",
      error:error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const checkUser = await User.findOne({ _id: req.params.id });
    if (!checkUser)
      return res.status(STATUSCODE.NOT_FOUND).json({
        status: "failed",
        message: "user does not exist",
      });

    const filter = {
      _id: req.params.id,
    };
    const update = req.body;

    const user = await User.findOneAndUpdate(filter, update,{ new: true });

    return res.status(STATUSCODE.OK).json({
      status: "success",
      message:"user updated successfully!",
      user,
    });
  } catch (error) {
    return res.status(STATUSCODE.SERVER_ERROR).json({
      status: "failed",
      error: error.message,
    });
  }
};


exports.deleteUser =  async(req, res) =>{
  try{ 
    const checkUser = await User.findOne({ _id: req.params.id });
    if (!checkUser)
      return res.status(STATUSCODE.NOT_FOUND).json({
        status: "failed",
        message: "user does not exist",
      });

     await User.findByIdAndDelete({_id:req.params.id}) 
    return res.status(STATUSCODE.OK).json({
    status: "success",
    message: "user deleted successfully!",
  });

  } catch(error){
    return res.status(STATUSCODE.SERVER_ERROR).json({
      status: "failed",
      error: error.message,
    });
  }
}