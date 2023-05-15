const Userdatabse  = require('../database/user.database')
const STATUSCODE = require("../utils/status-codes");

/**
 * the service will server as the business logic
 * the service will basically interact with the contoller asn database by receicing, manipulating and then returning datas to the contoller then to the client client
 */
exports.createUser = async(data) => {

    const user  = await Userdatabse.findOneByEmail(data.email)

    if(user){
        return {
            STATUS_CODE:STATUSCODE.BAD_REQUEST,
            STATUS:"failed ",
            MESSAGE:"user already exist",
            // DATA: user
        }
    }
    // console.log(user)
    const createuser  = await Userdatabse.create(data)

    return {
        STATUS_CODE:STATUSCODE.CREATED,
        STATUS:"success ",
        MESSAGE:"created successfully",
        DATA: createuser
    }
}

exports.login = async(data) => {
    const user  =  await Userdatabse.findOneByEmail(data)
    if(user){
        return {
            STATUS_CODE:STATUSCODE.OK,
            STATUS:"success ",
            DATA: user
        }
    }
    return{
        STATUS_CODE:STATUSCODE.BAD_REQUEST ,
        STATUS:"failed ",
        MESSAGE:"Invalid Credentials",
    }
    
}

exports.getUser = async(data) => {

    const user  = await Userdatabse.findOneById(data)

    if(user){
        // console.log(user)
        return {
            STATUS_CODE:STATUSCODE.OK,
            STATUS:"success ",
            DATA: user
        }
    }
    return{
        STATUS_CODE:STATUSCODE.NOT_FOUND ,
        STATUS:"failed ",
        MESSAGE:"user does not exist",
    }
    
}