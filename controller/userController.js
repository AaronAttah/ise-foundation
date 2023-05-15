const mongoose = require("mongoose");
const User = require("../models/user");
const STATUSCODE = require("../utils/status-codes");
const {generateUserToken} = require("../config/jwtToken")
const Userservices =  require('../services/user.service')
const Usercache =  require("../caching/user.cache")


/**
 * the controler will server as the data logic
 * the controler will basically interact with the client by receicing and returning datas to client
 */
exports.createUser = async (req, res) => {
  const { first_name, last_name, email, phone } = req.body;
  try {
    if(!first_name || !last_name || !email || !phone) 
    return res.status(STATUSCODE.BAD_REQUEST).json({
      status: "failed",
      message: "all fields are required",
    });

    const data = await Userservices.createUser(req.body)
    return  res.status(data.STATUS_CODE).json({
          status: data.STATUS,
          message: data.MESSAGE,
          data: data.DATA
        });

 
  } catch (error) {
    return res.status(STATUSCODE.SERVER_ERROR).json({
      status: "failed",
      error: error.message,
    });
  }
};




// ----------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------
exports.login = async(req, res) => {
  try{
    const {email} = req.body

    
    if(!email) 
    return res.status(STATUSCODE.BAD_REQUEST).json({
      status: "failed",
      message: "email is required to have access",
    });

    
    const data = await Userservices.login(email)
    const token = generateUserToken(data)

    if (data)
      return res.status(data.STATUS_CODE).json({
        data,
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
    const cachedData = await Usercache.getUser(`user-${req.params.id}`)
    if(cachedData) {
       return  res.json({cached:JSON.parse(cachedData)})
    }

    const data = await Userservices.getUser(req.params.id)
    if (!data)
      return  res.status(data.STATUS_CODE).json({
        status: data.STATUS,
        message: data.MESSAGE,
      });

      Usercache.addUser(`user-${req.params.id}`, data)
      return  res.status(data.STATUS_CODE).json({
        data 
      });

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