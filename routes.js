'use strict';
let bcrypt = require("bcrypt");
let express = require("express");



let router = express.Router();
// var controller = require('./controller');
let app = require('./app');

router.get("/hi", function(req, res,next){
  let array = [];
    console.log("Hey");
      array.push({id:"1"});
            array[0]["name"] = "Me";
            res.json({
              "result" : array
            });
});


    router.post("/insertTestData/:name", function(req, res){
      console.log("Hello");
      let sql = `INSERT INTO airbnb.testing(name) VALUES(?)`;
      let values = [req.params.name];
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
    gym,

    place_description,
    place_title,

    suitable_for_children,
    suitable_for_infants,
    suitable_for_pets,
    smoking_allowed,
    parties_allowed,
    additional_rules,
    listing_length,
    arrive_after,
    leave_before,
    min_stay,
    max_stay,
    price,

    date_listed

  )
  VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
     ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
     ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
     ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
     ?, ?, ?, ?);`

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
    req.body.gym,

    req.body.place_description,
    req.body.place_title,

    req.body.suitable_for_children,
    req.body.suitable_for_infants,
    req.body.suitable_for_pets,
    req.body.smoking_allowed,
    req.body.parties_allowed,
    req.body.additional_rules,
    req.body.listing_length,
    req.body.arrive_after,
    req.body.leave_before,
    req.body.min_stay,
    req.body.max_stay,
    req.body.price,

    req.body.date_listed
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
  let values = [];

  for(let i = 0 ; i < req.body.image_path.length; i++){
    console.log(req.body.caption[i]);
    values.push([req.body.image_path[i], req.body.caption[i], req.body.listing_id]);
  }

  let sql = `INSERT INTO airbnb.images(image_path, caption, listing_id) VALUES ?`
  console.log(values);

  app.con.query(sql, [values], function(err, result) {
    if(err) return console.log(err);
    console.log("Image listing inserted");
    console.log(result);
    res.sendStatus(200);
  });

});

router.get("/listingImageAndTitle/:user_id", function(req, res){
  let sql = `SELECT * FROM airbnb.listings WHERE user_id = ?;`
  let values = [req.params.user_id];
  let view_listing_id_array = [];
  let view_listing_data_array = [];


  //get place_title and listing_id (for images table) in listing table
  app.con.query(sql, values, function(err, result){
    for(let i = 0; i < result.length; i++){
      view_listing_id_array.push(result[i].id);
      view_listing_data_array.push({
        id:result[i].id,
        place_title: result[i].place_title
      });


    }

    //get image_path  in images table
    for(let i = 0; i < view_listing_id_array.length; i ++){
      let sql = `SELECT * FROM airbnb.images WHERE listing_id = ?;`
      let values = [view_listing_id_array[i]];
      console.log(view_listing_id_array[i] + "");

      app.con.query(sql, values, function(err, result){
        console.log(result[0].image_path);
        view_listing_data_array[i]["image_path"] = result[i].image_path;
        if(i == view_listing_id_array.length - 1){

          res.json({
            "result" :  view_listing_data_array
          });
        }
      });
    }

  });
});

//GET ID of listings table to show lisitng data
router.get("/listingData/:id", function(req, res){
  // let sql = `SELECT * FROM airbnb.listings WHERE id = ?;`
  let sql = `SELECT * FROM airbnb.listings
  INNER JOIN airbnb.images ON airbnb.listings.id = airbnb.images.listing_id
  WHERE airbnb.listings.id = ?`
  let listing_image_data= [];
  let values = [req.params.id]
  app.con.query(sql, values, function(err, result){
    console.log(result.length + "Love you :)");
    for(let i = 0; i < result.length; i++){
      listing_image_data.push({
        "image_path": result[i].image_path,
        "caption": result[i].caption,
        "listing_id": result[i].listing_id
      });
    }
  res.json({
        "id": result[0].id,
        "property_ownership": result[0].property_ownership,
        "property_type" : result[0].property_type,
        "total_guest": result[0].total_guest,
        "total_bedrooms": result[0].total_bedrooms,
        "total_beds": result[0].total_beds,
        "total_bathrooms": result[0].total_bathrooms,
        "bathroom_type": result[0].bathroom_type,
        "country": result[0].country,
        "street": result[0].street,
        "extra_place_details": result[0].extra_place_details,
        "city": result[0].city,
        "state": result[0].state,
        "lng": result[0].lng,
        "lat": result[0].lat,
        "essentials": result[0].essentials,
        "internet": result[0].internet,
        "shampoo": result[0].shampoo,
        "hangers": result[0].hangers,
        "tv": result[0].tv,
        "heating": result[0].heating,
        "air_conditioning": result[0].air_conditioning,
        "breakfast": result[0].breakfast,
        "kitchen": result[0].kitchen,
        "laundry": result[0].laundry,
        "parking": result[0].parking,
        "elevator": result[0].elevator,
        "pool": result[0].pool,
        "gym": result[0].gym,

        "place_description": result[0].place_description,
        "place_title": result[0].place_title,

        "suitable_for_children": result[0].suitable_for_children,
        "suitable_for_infants": result[0].suitable_for_infants,
        "suitable_for_pets": result[0].suitable_for_pets,
        "smoking_allowed": result[0].smoking_allowed,
        "parties_allowed": result[0].parties_allowed,
        "additional_rules": result[0].additional_rules,
        "listing_length": result[0].listing_length,
        "arrive_after": result[0].arrive_after,
        "leave_before": result[0].leave_before,
        "min_stay": result[0].min_stay,
        "max_stay": result[0].max_stay,
        "price": result[0].price,

        "date_listed": result[0].date_listed,
        "image_data": listing_image_data
    });


  });

});

//profile  section
router.post("/insertProfileImagePath/:id/:profile_image_path", function(req, res){
  let sql = `UPDATE airbnb.user_authentication SET airbnb.user_authentication.profile_image_path = ? WHERE airbnb.user_authentication.id = ?;`;
  let values = [req.params.profile_image_path, req.params.id];
  app.con.query(sql, values, function(err, result){
    console.log("--INSERT PROFILE IMAGE PATH--");
    if(err) return console.log(err);
    console.log(`Updated profile_image_path or profile_pic`);
    res.sendStatus(200);
  });
});

router.get("/getUserData/:id", function(req, res){
  let sql = `SELECT * FROM airbnb.user_authentication WHERE airbnb.user_authentication.id = ?;`;
  let values = [req.params.id];
  app.con.query(sql, values, function(err, result){
    console.log("--GET PROFILE IMAGE PATH--");
    if(err) return console.log(err);
    console.log("Retrieved user_authentication");
    res.json({
      "id": result[0].id,
      "first_name": result[0].first_name,
      "last_name": result[0].last_name,
      "email": result[0].email,
      "password": result[0].password,
      "phone_num":  result[0].phone_num,
      "profile_image_path":result[0].profile_image_path,
      "gender": result[0].gender,
      "location" : result[0].location,
      "work" : result[0].work
    });
  });
});


module.exports = router;
