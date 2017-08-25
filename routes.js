'use strict';
let bcrypt = require("bcrypt");
let express = require("express");



let router = express.Router();
// var controller = require('./controller');
let app = require('./app');

router.get("/", function(req, res){
  let sql = "SELECT * FROM airbnb.user_authentication";
  console.log("Hey");
  app.con.query(sql, function (err, result) {
    if(err)console.log(err);
    res.json({result: result});
  });
});


router.post("/register", function(req, res){
  console.log("--REGISTER ROUTE--")
  console.log(req.body);
  bcrypt.hash(req.body.password, 10)
  .then((hash) =>{

    req.body.password = hash;
    let sql = "INSERT INTO airbnb.user_authentication(first_name, last_name, email, password, phone_num)"
    +"VALUES(?, ?, ? ,? ,?)";

    let values = [req.body.first_name,req.body.last_name,
    req.body.email,req.body.password,req.body.phone_num];

    app.con.query(sql, values, function(err, result) {
      if(err) return console.log(err);
      console.log("1 record inserted");
    });

  })
  .catch((error) => console.log(error));
});

router.post("/login", function(req, res){
  console.log("--LOGIN ROUTE--");
  let sql = "SELECT * FROM airbnb.user_authentication WHERE email = ?" ;
  let value = req.body.email;
  app.con.query(sql, value,  function(error, result){
    if(error){
      console.log("Error");
      return console.log(error);
    }
    console.log("Password: " + result[0].password);

   //Check Password
    bcrypt.compare(req.body.password, result[0].password)
    .then((match) => {
        if(match){
          console.log("Password matched");
          res.json({
            "passwordMatch": true,
            "email": result[0].email ,
            "first_name": result[0].first_name,
            "last_name": result[0].last_name,
            "phone": result[0].phone
          });

        }else{
          console.log("Password is incorrect")
          res.json({
            "passwordMatch": false
          });

        }
      })
      .catch((error) =>{
        console.log(error)
      });
    });
});



module.exports = router;
