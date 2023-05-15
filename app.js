const express = require("express");
const morgan = require('morgan');
const  mongoose  = require("mongoose");
const dotenv = require('dotenv');
const dbConnect = require("./config/dbConnect");
const sqlConnect = require("./config/sqlConnect");
// const Redis = require("ioredis"); //for catching data using IOredis
const User = require("./models/user");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const routes = require('./routes');



const app = express();
dotenv.config();

/*
 * connecting DB
 */
dbConnect();
// sqlConnect();


app.use(morgan('dev'));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/v1', routes);

//handle all errors


app.use(notFound);
app.use(errorHandler);

module.exports = app
