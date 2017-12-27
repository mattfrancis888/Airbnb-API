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
            let sql = `SELECT * FROM airbnb.listings`
            for(let i = 0; i < 2; i ++){
              app.con.query(sql, function(err, result){
                  console.log("for-loop MYSQL");
              });
            console.log("for-loop");
            }
            console.log("out of for-loop");
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
      return error;
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
      res.sendStatus(200);
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


router.get("/totalListingsData/:country/:street/:city/:state" +
  "/:total_guest/:suitable_for_infants/:suitable_for_children/:suitable_for_pets", function(req, res){

  if(req.params.country == " " )
    req.params.country = "%";
  else
    req.params.country = "%" + req.params.country + "%"
  if(req.params.street == " " )
    req.params.street = "%";
  else
    req.params.street = "%" + req.params.street + "%"
  if(req.params.city == " " )
    req.params.city = "%";
  else
    req.params.city = "%" + req.params.city + "%";
  if(req.params.state == " " )
    req.params.state = "%";
  else
    req.params.state = "%" + req.params.state + "%";
  if(req.params.total_guest == " " )
    req.params.total_guest = "%";
  else
    req.params.total_guest =  parseInt(req.params.total_guest) ;
  if(req.params.suitable_for_infants == " " )
    req.params.suitable_for_infants = "%";
  else
      req.params.suitable_for_infants = parseInt(req.params.suitable_for_infants);
  if(req.params.suitable_for_children == " " )
    req.params.suitable_for_children = "%";
  else
    req.params.suitable_for_children = parseInt(req.params.suitable_for_children);
  if(req.params.suitable_for_pets == " " )
    req.params.suitable_for_pets = "%";
  else
    req.params.suitable_for_pets = parseInt(req.params.suitable_for_pets);

  let sql = `SELECT COUNT(*) AS total_listings FROM airbnb.listings
  WHERE country LIKE ?  AND street LIKE ? AND city LIKE ? AND state LIKE ? AND CAST(total_guest AS UNSIGNED) >= ?
    AND suitable_for_infants LIKE ? AND suitable_for_children LIKE ? AND suitable_for_pets LIKE ?`;


  let values = [req.params.country, req.params.street, req.params.city, req.params.state, req.params.total_guest,
  req.params.suitable_for_infants, req.params.suitable_for_children, req.params.suitable_for_pets];

  app.con.query(sql, values, function(err, result) {
    if(err) return console.log(err);
    console.log("--TOTAL LISTINGS ---");
    console.log("SQL:" + sql);
    console.log("values:"  + values);
    res.json({
      "total_listings": result[0].total_listings
    })
    // console.log(result[0].total_listings);
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
    //empty booking list
    if(view_listing_id_array.length == 0){
      res.json({
        "result" :  view_listing_data_array
      });
      return;
    }
    //get image_path  in images table from each listing
    for(let i = 0; i < view_listing_id_array.length; i ++){
      let sql = `SELECT * FROM airbnb.images WHERE listing_id = ?;`
      let values = [view_listing_id_array[i]];
      console.log(view_listing_id_array[i]);

      app.con.query(sql, values, function(err, result){
        if(err) return console.log(err);
        view_listing_data_array[i]["image_path"] = result[0].image_path;
          console.log(result);
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
  console.log("--LISTING DATA--");
  let sql = `SELECT * FROM airbnb.listings
  INNER JOIN airbnb.images ON airbnb.listings.id = airbnb.images.listing_id
  WHERE airbnb.listings.id = ?`
  let listing_image_data= [];
  let values = [req.params.id]
  app.con.query(sql, values, function(err, result){
    console.log(result.length + " image(s) in listing");
    for(let i = 0; i < result.length; i++){
      listing_image_data.push({
        "image_path": result[i].image_path,
        "caption": result[i].caption,
        "listing_id": result[i].listing_id
      });
    }
    console.log(result);
  res.json({
        "id": result[0].id,
        "user_id": result[0].user_id,
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



router.get("/multipleListingsData/:showRowsAfter/:showAmountOfRows/:country/:street/:city/:state" +
  "/:total_guest/:suitable_for_infants/:suitable_for_children/:suitable_for_pets", function(req, res){
  console.log("--MULTIPLE LISTING DATA--");
  let sql = `SELECT * FROM airbnb.listings LIMIT ?, ?`;
  let values = [parseInt(req.params.showRowsAfter), parseInt(req.params.showAmountOfRows)];
  let listing_id_array = [];
  let listing_data_array = [];


  //get place_title and listing_id (for images table) in listing table
  app.con.query(sql, values, function(err, result){
    if(err) return console.log(err);
    console.log(result);
    for(let i = 0; i < result.length; i++){
      listing_id_array.push(result[i].id);
      listing_data_array.push({
        "id":result[i].id,
        "property_ownership": result[0].property_ownership,
        "property_type" : result[0].property_type,
        "total_beds": result[0].total_beds,
        "place_title": result[i].place_title,
        "price": result[0].price
      });
    }
  //  get image_path in images table from each listing
    for(let i = 0; i < listing_id_array.length; i ++){
      let sql = `SELECT * FROM airbnb.images WHERE listing_id = ?;`
      let values = [listing_id_array[i]];
      console.log(listing_data_array[i]);

      app.con.query(sql, values, function(err, result){
        if(err) return console.log(err);
        listing_data_array[i]["image_path"] = result[0].image_path;
          console.log(result);
        if(i == listing_id_array.length - 1){
          res.json({
            "result" :  listing_data_array
          });
        }
      });

    }
  })

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

router.post("/insertAboutMe/:id", function(req, res){
  if(req.body.about_me == ""){
    req.body.about_me = null;
  }
  let sql = `UPDATE airbnb.user_authentication SET airbnb.user_authentication.about_me = ? WHERE airbnb.user_authentication.id = ?;`;
  let values = [req.body.about_me, req.params.id];
  app.con.query(sql, values, function(err, result){
    console.log("--INSERT ABOUT ME--");
    if(err) return console.log(err);
    console.log(`Updated about me`);
    res.sendStatus(200);
  });
});

router.post("/insertEmailDetailEdit/:id/", function(req, res){
  let sql = `UPDATE airbnb.user_authentication SET airbnb.user_authentication.email = ? WHERE airbnb.user_authentication.id = ?;`;
  let values = [req.body.email, req.params.id];
  app.con.query(sql, values, function(err, result){
    console.log("--INSERT EMAIL--");
    if(err) return console.log(err);
    console.log(`Updated email`);
    res.sendStatus(200);
  });
});


router.post("/insertPhoneNumDetailEdit/:id/", function(req, res){
  let sql = `UPDATE airbnb.user_authentication SET airbnb.user_authentication.phone_num = ? WHERE airbnb.user_authentication.id = ?;`;
  let values = [req.body.phone_num, req.params.id];
  app.con.query(sql, values, function(err, result){
    console.log("--INSERT PHONE NUM--");
    if(err) return console.log(err);
    console.log(`Updated phone num`);
    res.sendStatus(200);
  });
});


router.post("/insertLocationDetailEdit/:id", function(req, res){
  if(req.body.location == ""){
    req.body.location = null;
  }
  let sql = `UPDATE airbnb.user_authentication SET airbnb.user_authentication.location = ? WHERE airbnb.user_authentication.id = ?;`;
  let values = [req.body.location, req.params.id];
  app.con.query(sql, values, function(err, result){
    console.log("--INSERT PROFILE IMAGE PATH--");
    if(err) return console.log(err);
    console.log(`Updated location`);
    res.sendStatus(200);
  });
});


router.post("/insertWorkDetailEdit/:id", function(req, res){
  if(req.body.work == ""){
    req.body.work = null;
  }
  let sql = `UPDATE airbnb.user_authentication SET airbnb.user_authentication.work = ? WHERE airbnb.user_authentication.id = ?;`;
  let values = [req.body.work, req.params.id];
  app.con.query(sql, values, function(err, result){
    console.log("--INSERT WORK--");
    if(err) return console.log(err);
    console.log(`Updated work`);
    res.sendStatus(200);
  });
});

router.post("/insertLanguagesDetailEdit/:id/", function(req, res){
  if(req.body.languages == ""){
    req.body.languages = null;
  }
  let sql = `UPDATE airbnb.user_authentication SET airbnb.user_authentication.languages = ? WHERE airbnb.user_authentication.id = ?;`;
  let values = [req.body.languages, req.params.id];
  app.con.query(sql, values, function(err, result){
    console.log("--INSERT LANGUAGES--");
    if(err) return console.log(err);
    console.log(`Updated languages`);
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
      "about_me": result[0].about_me,
      "location" : result[0].location,
      "work" : result[0].work,
      "languages" : result[0].languages
    });
  });
});

//end of profile section

//save date_listed

router.post("/bookSchedule/:id/:listing_id", function(req, res){
  //check if user already booked a schedule
  let sql = `SELECT * FROM airbnb.bookings WHERE
  airbnb.bookings.user_id = ? AND
  airbnb.bookings.listing_id = ?`;
  let values = [req.params.id, req.params.listing_id];
  app.con.query(sql, values, function(err, result){
    console.log("--INSERT BOOK--");
    if(err) return console.log(err);
      console.log(result);
    if(result.length == 0){
      console.log("Inserting book schedule");
  // let sql = `INSERT INTO airbnb.testing(name) VALUES(?)`;
  console.log(req.params.id + req.params.listing_id + req.body.check_in + req.body.check_out);
      let sql = `INSERT INTO airbnb.bookings(user_id, listing_id, check_in, check_out) VALUES(?, ?, ?, ?)`;
      let values = [req.params.id, req.params.listing_id, req.body.check_in, req.body.check_out];
      app.con.query(sql, values, function(err, result){
        if(err) return console.log(err);
        console.log(`Inserted booking schedule`);
      });
    } else{
          console.log("Updating book schedule");

          let sql = `UPDATE airbnb.bookings SET
          airbnb.bookings.check_in = ?,
          airbnb.bookings.check_out = ?
          WHERE airbnb.bookings.user_id = ?
          AND airbnb.bookings.listing_id = ? ;`;
          let values = [req.body.check_in, req.body.check_out, req.params.id, req.params.listing_id];

          app.con.query(sql, values, function(err, result){
            console.log("Upadating booking schedule");
            if(err) return console.log(err);
            console.log(`Updated booking schedule`);

          });

    }
    res.sendStatus(200);
  });
});

router.get("/getBookingSchedules/:id/:listing_id", function(req, res){

    let sql = `SELECT * FROM airbnb.bookings WHERE
    airbnb.bookings.user_id = ? AND
    airbnb.bookings.listing_id = ?`;
  let values = [req.params.id, req.params.listing_id];
  app.con.query(sql, values, function(err, result){
    console.log("Getting booking schedules");
    if(err) return console.log(err);
    res.json({
       result
    });
  });

});

router.get("/bookingListingImageAndTitle/:user_id", function(req, res){
  let sql = `SELECT * FROM airbnb.bookings WHERE user_id = ?;`
  let values = [req.params.user_id];
  let listing_array = [];


  //get listing id
  app.con.query(sql, values, function(err, result){
    for(let i = 0; i < result.length; i++){
      listing_array.push({
        listing_id: result[i].listing_id,
        check_in: result[i].check_in,
        check_out: result[i].check_out
      });
    }
    console.log(listing_array.length);

    console.log("FINISHED GETTING listing_id");
    //nothing on booking list
    if(listing_array.length == 0){
      res.json({
        "result" :  listing_array
      });
      return;
    }

    //get place_title
    for(let i = 0; i < listing_array.length; i++){
      let sql = `SELECT * FROM airbnb.listings WHERE id = ?;`
      let values = [listing_array[i].listing_id];
      app.con.query(sql, values, function(err, result){
        console.log(result[0].place_title);
        listing_array[i].place_title = result[0].place_title;

          console.log("FINISHED GETTING place_title");
        for(let i = 0; i < listing_array.length; i ++){
          let sql = `SELECT * FROM airbnb.images WHERE listing_id = ?;`
          let values = listing_array[i].listing_id;
          console.log(values + "is the name");;

          app.con.query(sql, values, function(err, result){
            if(err) return console.log(err);
            console.log(result[i].image_path);
            listing_array[i].image_path = result[i].image_path;

            if(i == listing_array.length - 1){
              res.json({
                "result" :  listing_array
              });
            }
          });

        }


      });
    }

    //get image_path  in images table from each listing


  });
});

//edit listing
router.post("/updateListingImages/:listing_id", function(req, res){
      let sql = `INSERT INTO airbnb.images(image_path, caption, listing_id) VALUES(?, ?, ?)`;
      let values = [req.body.image_path, req.body.caption, req.params.listing_id];
      app.con.query(sql, values, function(err, result){
          console.log("--UPDATE IMAGES--");
          console.log(result);
          res.sendStatus(200);
      });
});

router.post("/updateCaption", function(req, res){

      let sql = `UPDATE airbnb.images SET caption = ? WHERE image_path = ?;`;
      let values = [req.body.caption, req.body.image_path];
      app.con.query(sql, values, function(err, result){
          console.log("--UPDATE CAPTION--");
          if(err) return console.log(err);
          console.log(result);
          res.sendStatus(200);
      });
});

router.post("/updateTitle/:listing_id", function(req, res){
  let sql = `UPDATE airbnb.listings SET place_title = ? WHERE id = ?;`;
  let values = [req.body.place_title, req.params.listing_id];

  app.con.query(sql, values, function(err, result){
    console.log("--UPDATE TITLE--");
    if(err) return console.log(err);
      console.log(result);
      res.sendStatus(200);
    });
});

router.post("/updateDescription/:listing_id", function(req, res){
  let sql = `UPDATE airbnb.listings SET place_description = ? WHERE id = ?;`;
  // let values = [req.body.place_title];

    let values = [req.body.place_description, req.params.listing_id];
    console.log(parseInt(req.params.i));
    app.con.query(sql, values, function(err, result){
      console.log("--UPDATE DESCRIPTION--");
      if(err) return console.log(err);
      console.log(result);
      res.sendStatus(200);

      });
});

router.post("/updateRoomsAndGuests/:listing_id", function(req, res){
  let sql = `UPDATE airbnb.listings SET total_guest = ?,
   total_bedrooms = ?,
   total_beds = ?
   WHERE id = ?;`;

   console.log(req.body.total_guest,  req.body.total_bedrooms,req.body.total_beds, req.params.listing_id );
  // let values = [req.body.place_title];

    let values = [req.body.total_guest, req.body.total_bedrooms,
      req.body.total_beds,req.params.listing_id];

    app.con.query(sql, values, function(err, result){
      console.log("--UPDATE ROOM AND GUEST--");
      if(err) return console.log(err);
      console.log(result);
      res.sendStatus(200);
    });
});

function stringBooleanToInteger(boolean){
  if(boolean == true){
    return 1;
  } if(boolean == false){
    return 0;
  }
}

router.post("/updateAmenitiesItem/:listing_id", function(req, res){
  let sql = `UPDATE airbnb.listings SET essentials = ?,
  internet = ?, shampoo = ?, hangers = ?, tv = ?, heating = ?, air_conditioning = ?, breakfast = ?
   WHERE id = ?;`;
  // let values = [req.body.place_title];
    console.log(req.body.internet + "is" + stringBooleanToInteger(req.body.internet));
    let values = [stringBooleanToInteger(req.body.essentials),
      stringBooleanToInteger(req.body.internet),
      stringBooleanToInteger(req.body.shampoo),
      stringBooleanToInteger(req.body.hangers),
      stringBooleanToInteger(req.body.tv),
      stringBooleanToInteger(req.body.heating),
      stringBooleanToInteger(req.body.air_conditioning),
      stringBooleanToInteger(req.body.breakfast),
      req.params.listing_id];

    app.con.query(sql, values, function(err, result){
      console.log("--UPDATE AMENITIES ITEM--");
      if(err) return console.log(err);
      console.log(result);
      res.sendStatus(200);
    });
});

router.post("/updateAmenitiesSpace/:listing_id/", function(req, res){
  let sql = `UPDATE airbnb.listings SET kitchen = ?, laundry = ?, parking = ?, elevator = ?, pool = ?, gym = ?
   WHERE id = ?;`;
  // let values = [req.body.place_title];

    let values = [stringBooleanToInteger(req.body.kitchen),
                  stringBooleanToInteger(req.body.laundry),
                  stringBooleanToInteger(req.body.parking),
                  stringBooleanToInteger(req.body.elevator),
                  stringBooleanToInteger(req.body.pool),
                  stringBooleanToInteger(req.body.gym),
                  req.params.listing_id];

    app.con.query(sql, values, function(err, result){
      console.log("--UPDATE AMENITIES SPACE--");
      if(err) return console.log(err);
      console.log(result);
      res.sendStatus(200);
    });
});

router.post("/updateLocation/:listing_id/", function(req, res){
  let sql = `UPDATE airbnb.listings SET country = ?,
  street = ?, extra_place_details = ?, city = ?, state = ?
   WHERE id = ?;`;
  // let values = [req.body.place_title];
  let values = [req.body.country,
                req.body.street,
                req.body.extra_place_details,
                req.body.city,
                req.body.state,
                req.params.listing_id];

    app.con.query(sql, values, function(err, result){
      console.log("--UPDATE LOCATION--");
      if(err) return console.log(err);

      console.log(result);
      res.sendStatus(200);
    });
});

router.post("/updateHouseRules/:listing_id/", function(req, res){
  let sql = `UPDATE airbnb.listings SET
  suitable_for_children = ?, suitable_for_infants = ?, suitable_for_pets
   = ?, smoking_allowed = ?, parties_allowed = ?, additional_rules = ?
   WHERE id = ?;`;
  // let values = [req.body.place_title];

    let values = [stringBooleanToInteger(req.body.suitable_for_children),
                  stringBooleanToInteger(req.body.suitable_for_infants),
                  stringBooleanToInteger(req.body.suitable_for_pets),
                  stringBooleanToInteger(req.body.smoking_allowed),
                  stringBooleanToInteger(req.body.parties_allowed),
                  req.body.additional_rules,
                  req.params.listing_id];

    app.con.query(sql, values, function(err, result){
      if(err) return console.log(err);
      console.log("--UPDATE HOUSE RULES--");
      console.log(result);
      res.sendStatus(200);
    });
});


router.post("/updateBooking/:listing_id/", function(req, res){
  let sql = `UPDATE airbnb.listings SET listing_length = ?,
  arrive_after = ?, leave_before = ?, min_stay = ?, max_stay = ? WHERE id = ?;`;

    let values = [req.body.listing_length,
                  req.body.arrive_after,
                  req.body.leave_before,
                  req.body.min_stay,
                  req.body.max_stay,
                  req.params.listing_id];

    app.con.query(sql, values, function(err, result){
      console.log("--UPDATE BOOKING--");
      if(err) return console.log(err);
      console.log(result);
      res.sendStatus(200);
    });
});

router.post("/updatePrice/:listing_id/", function(req, res){
  let sql = `UPDATE airbnb.listings SET price = ? WHERE id = ?`;

    let values = [req.body.price,
                  req.params.listing_id];

    app.con.query(sql, values, function(err, result){
      console.log("--UPDATE PRICE--");
      if(err) return console.log(err);
        console.log(result);
        res.sendStatus(200);
    });
});


router.get("/bookingsToDeleteData/:listing_id", function(req, res){
      let sql = `
    SET @date_listed = (SELECT date_listed FROM airbnb.listings WHERE id = ?);
    SET @listing_length = (SELECT listing_length FROM airbnb.listings where id = ?);
    SET @listing_expiry = (DATE_ADD(@date_listed,INTERVAL @listing_length MONTH));


    SELECT @listing_expiry ;
    SELECT * from airbnb.bookings where user_id = ? and
    check_in < @listing_expiry or check_out < @listing_expiry`;


    let values = [req.params.listing_id, req.params.listing_id, req.params.listing_id, req.params.listing_id];

    app.con.query(sql, values, function(err, result){
      console.log("--BOOKINGS TO DELETE--");
      if(err) return console.log(err);
      let lastObjectInResult = result.length - 1;
      console.log(result[lastObjectInResult][0].user_id + "is the user_id of the booking that is going to be deleted");
      let user_id_array = [];
      let listing_id_array = [];
      let check_in_array = [];
      let check_out_array = [];
      for(let i = 0; i < result[lastObjectInResult].length; i ++){
        user_id_array.push({"user_id" : result[lastObjectInResult][i].user_id});
        listing_id_array.push({"listing_id" : result[lastObjectInResult][i].listing_id});
        check_in_array.push({"check_in": result[lastObjectInResult][i].check_in});
        check_out_array.push({"check_out": result[lastObjectInResult][i].check_out});
      }
      console.log(user_id_array);
      res.json({
        "user_id" :  user_id_array,
        "listing_id" :listing_id_array,
        "check_in" :  check_in_array,
        "check_out" :check_out_array
      });

    });
});



router.delete("/deleteBookings/:id/", function(req, res){
  let sql = `
            start transaction;
            SET @date_listed = (SELECT date_listed FROM airbnb.listings WHERE id = ?);
            SET @listing_length = (SELECT listing_length FROM airbnb.listings where id = ?);

            SET @listing_expiry = (
            DATE_ADD(@date_listed,INTERVAL @listing_length MONTH)
            );


            DELETE from airbnb.bookings where user_id = ? AND
              check_in < @listing_expiry or check_out < @listing_expiry  ;`;


        let values = [req.params.listing_id, req.params.listing_id, req.params.listing_id, req.params.listing_id];

    app.con.query(sql, values, function(err, result){
      console.log("--DELETE DATE--");
      if(err) return console.log(err);

        res.sendStatus(200);
    });
});


// router.get(`/searchFilter/:country/:street/:city/:state/
// :total_guest/:suitable_for_infants/:suitable_for_children/:suitable_for_pets`, function(req, res){
//   let sql = 'SELECT * FROM airbnb.listings WHERE country = ?';
//   let values = [req.params.country];
//
//   app.con.query(sql, values, function(err, result){
//     if(err) return err;
//     console.log("--SEARCH FILTER--");
//     console.log(result);
//     res.sendStatus(200);
//   });
// });

router.get(`/searchFilter/:country/:street/:state`, function(req, res){
  let sql = 'SELECT * FROM airbnb.listings WHERE country = ? AND state = ?';
  let values = [req.params.country, req.params.state];

  app.con.query(sql, values, function(err, result){
    if(err) return err;
    console.log("--SEARCH FILTER--");
    let listing_id_array = [];
    let listing_data_array = [];


    //get place_title and listing_id (for images table) in listing table
    app.con.query(sql, values, function(err, result){
      if(err) return console.log(err);
      console.log(result);
      for(let i = 0; i < result.length; i++){
        listing_id_array.push(result[i].id);
        listing_data_array.push({
          "id":result[i].id,
          "property_ownership": result[0].property_ownership,
          "property_type" : result[0].property_type,
          "total_beds": result[0].total_beds,
          "place_title": result[i].place_title,
          "price": result[0].price
        });
      }
    //  get image_path in images table from each listing
      for(let i = 0; i < listing_id_array.length; i ++){
        let sql = `SELECT * FROM airbnb.images WHERE listing_id = ?;`
        let values = [listing_id_array[i]];
        console.log(listing_data_array[i]);

        app.con.query(sql, values, function(err, result){
          if(err) return console.log(err);
          listing_data_array[i]["image_path"] = result[0].image_path;
            console.log(result);
          if(i == listing_id_array.length - 1){
            res.json({
              "result" :  listing_data_array
            });
          }
        });

      }
    })

  });
});
//FIX IMAGESLIDER PAGE

module.exports = router;
