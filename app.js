const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const app = express();
const connectMongo = require("./db");
const employeesRoute = require('./routes/employees');
const worklogsRoute = require('./routes/worklogs');

// Requiring dotenv package for using environment variables from .env file while development
require("dotenv").config()

// Asteblishing connection to mongodb server
connectMongo();

// Using body parser to support parsing of application/json type post data and parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Adding routing using for the each api
app.use('/employees', employeesRoute);
app.use('/worklogs', worklogsRoute);

// Running the app on specified port with express
app.listen(port, () => console.log(`Listening on port ${port}`));