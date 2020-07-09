const express = require("express");
const bodyParser = require("body-parser");
const port = process.env.PORT || 3000;
const app = express();
const connectMongo = require("./db");
const employeesRoute = require('./routes/employees');
const worklogsRoute = require('./routes/worklogs');

require("dotenv").config()

connectMongo();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/employees', employeesRoute);
app.use('/worklogs', worklogsRoute);

app.listen(port, () => console.log(`Listening on port ${port}`));