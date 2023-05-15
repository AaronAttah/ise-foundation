// doing the  sequelize something for SQL DB's

const {Sequelize} = require("sequelize")
const dotenv = require('dotenv');
dotenv.config();


const  sqlConnect = async() => {

const sequelize = new Sequelize(
  process.env.SQL_DB,
  process.env.SQL_USER,
  process.env.SQL_PASSWORD,
    {
    host:'localhost',
    dialect:'postgres'
// pool: {
//     max: dbConfig.pool.max,
//     min: dbConfig.pool.min,
//     acquire: dbConfig.pool.acquire,
//     idle: dbConfig.pool.idle,
//   },
    }
)
 await sequelize
  .authenticate()
  .then(() => {
    console.log("sql Database Now connected...");
  })
  .catch((err) => {
    console.log("DB--Error " + err);
  });



  // to wipe the Db before upadting set force: true otherwise false
sequelize.sync({ force: false }).then(() => {
    console.log(" YES re-sync done and its working successfully!");
    // intial();
  });

} 


  
module.exports = sqlConnect