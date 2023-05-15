const Redis = require("ioredis"); //for catching data using IOredis
const dotenv = require("dotenv");
dotenv.config();

const getRedisUrl = () =>{
	if(process.env.REDIS_URL){
		return process.env.REDIS_URL
}
	throw new Error("Redis URL is not defined")
}

const redis = new Redis(
    getRedisUrl()
    //  process.env.REDIS_URL,
);


exports.getUser = async(data) =>{
        const cachedData = await redis.get(`user-${data}`) 

    return cachedData
}

exports.addUser = async(key, data) => {
      redis.set(`user-${key}`, JSON.stringify(data))

}

