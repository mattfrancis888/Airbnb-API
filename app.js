require('dotenv').config();
var mysql = require("mysql");
var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var routes = require("./routes.js");
var port = process.env.PORT || 3000;

app.listen(port, '0.0.0.0',function(){
  console.log("server is listening on port");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var con = mysql.createConnection({
  // host: "127.0.0.1",
  host: "localhost",
  port: 3306,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  multipleStatements: true
});

con.connect(function(err) {
  if (err) return console.log(err);
  console.log("Connected to mysql!");
});


app.use("/", routes);

module.exports.con = con;
