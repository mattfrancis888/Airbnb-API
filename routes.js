'use strict';
let bcrypt = require("bcrypt");
let express = require("express");



let router = express.Router();
// var controller = require('./controller');
let app = require('./app');

router.get("/hi", function(req, res,next){
    console.log("Hey");

});


router.post("/insertTestData", function(req, res){
  console.log("Hello");
  let sql = `INSERT INTO airbnb.testing(name) VALUES(?)`;
  let values = [req.body.name];
  app.con.query(sql, values, function (err, result) {
    console.log(result);
  });
});

router.get("/", function(req, res){
  let sql = "SELECT * FROM airbnb.user_authentication";
  console.log("Hey");
  app.con.query(sql, function (err, result) {
    if(err)console.log(err);
    res.json({result: result});
  });
});


router.get("/findUser/:email", function(req, res){
  console.log("--FIND USER ROUTE--")
  let sql = "SELECT * FROM airbnb.user_authentication WHERE email = ?";
  let value = req.params.email;
  app.con.query(sql, value,  function(error, result){
    console.log(result);
    if(result.length == 0){
      res.json({
        "email": "null"
      });
    }else{
      res.json({
        "email": result[0].email
      });
    }
    if(error){
      console.log("Error");
      console.log(error);
    }
  });
});


router.post("/register", function(req, res){
  console.log("--REGISTER ROUTE--")
  console.log(req.body);
  bcrypt.hash(req.body.password, 10)
  .then((hash) =>{

    req.body.password = hash;
    let sql = `INSERT INTO airbnb.user_authentication(first_name, last_name, email, password, phone_num)
    VALUES(?, ?, ? ,? ,?)`;
    console.log(req.body.phone_num)
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
  let sql = `SELECT * FROM airbnb.user_authentication WHERE email = ?` ;
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
            "user_id": result[0].id,
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

router.post("/insertListingData", function(req,res){
  console.log("--INSERT LISTING DATA--");
  let sql = `INSERT INTO airbnb.listings(
    user_id,
    property_ownership,
    property_type,
    total_guest,
    total_bedrooms,
    total_beds,
    total_bathrooms,
    bathroom_type,
    country,
    street,
    extra_place_details,
    city,
    state,
    lng,
    lat,
    essentials,
    internet,
    shampoo,
    hangers,
    tv,
    heating,
    air_conditioning,
    breakfast,
    kitchen,
    laundry,
    parking,
    elevator,
    pool,
    gym
  )
  VALUES(?, ?, ?, ? ,? ,?, ?, ?, ? ,? , ?, ?, ?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`

  let values = [
    req.body.user_id,
    req.body.property_ownership,
    req.body.property_type,
    req.body.total_guest,
    req.body.total_bedrooms,
    req.body.total_beds,
    req.body.total_bathrooms,
    req.body.bathroom_type,
    req.body.country,
    req.body.street,
    req.body.extra_place_details,
    req.body.city,
    req.body.state,
    req.body.lng,
    req.body.lat,

    req.body.essentials,
    req.body.internet,
    req.body.shampoo,
    req.body.hangers,
    req.body.tv,
    req.body.heating,
    req.body.air_conditioning,
    req.body.breakfast,
    req.body.kitchen,
    req.body.laundry,
    req.body.parking,
    req.body.elevator,
    req.body.pool,
    req.body.gym
  ];

  app.con.query(sql, values, function(err, result) {
    if(err) return console.log(err);
    console.log("Listing data inserted");
    console.log(result);
    res.json({
      "id": result.insertId
    });
  });
});

router.post("/insertListingImages", function(req, res){
  console.log("--INSERT LISTING IMAGES--")
  let sql = `INSERT INTO airbnb.images(image_path, listing_id) VALUES(?, ?)`
  let values = [req.body.image_path, req.body.listing_id];
  app.con.query(sql, values, function(err, result) {
    if(err) return console.log(err);
    console.log("Image listing inserted");
    console.log(result);
  });

});


module.exports = router;
