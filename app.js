const express = require("express");
const morgan = require('morgan');
const  mongoose  = require("mongoose");
const dotenv = require('dotenv');
const dbConnect = require("./config/dbConnect");
const User = require("./models/user");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const routes = require('./routes');



const app = express();
dotenv.config();


/*
 * connecting DB
 */
dbConnect();

app.use(morgan('dev'));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/v1', routes);

//handle all errors


app.use(notFound);
app.use(errorHandler);
// app.listen(PORT_NO, () => {
//   console.log("Server started and listening on port: ".concat(PORT_NO));
// });

module.exports = app
