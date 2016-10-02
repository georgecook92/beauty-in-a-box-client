var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var pool = require('../db/connect');
const saltRounds = 10;

router.post('/login', function(req,res,next) {
  const email = req.body.email;
  const password = req.body.password;

  var emailCheckSQL = 'select * from `_users` where `email` ="' + email + '"';

  pool.getConnection(function(err,connection){
    connection.query(emailCheckSQL, function(err,result){
      if (err) {
        console.log(err);
        connection.release();
      }

      if (result.length > 0) {
        //do something if email exists

        // Load hash from your password DB.
      //  console.log('pw', password);
      //  console.log('resultpw', result[0].password);
        bcrypt.compare(password, result[0].password, function(err, comparisonValue) {
            if (err) {
              console.log(err);
              connection.release();
            }

            if (comparisonValue) {
              console.log('correct.');
              connection.release();
              res.status(200).json({
                "email" : result[0].email,
                "firstName" : result[0].first_name,
                "lastName" : result[0].last_name,
                "phone" : result[0].phone
               });
            } else {
              console.log('wrong.');
              connection.release();
              res.status(422).json( {"error": "Incorrect Password"} );
            }
        });

      } else {
        connection.release();
        res.status(404).json({'error': 'Email is not registered'});
      }

    });
  });


});

router.post('/register', function(req,res,next) {
  const email = req.body.email;
  var password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const phone = req.body.phone;

  var emailCheckSQL = 'select * from `_users` where `email` ="' + email + '"';

  pool.getConnection(function(err,connection){
    connection.query(emailCheckSQL, function(err,result) {
      if (err) {
        console.log(err);
        connection.release();
      }

      if (result.length > 0) {
        connection.release();
        res.status(422).json({'error': 'exists'});
      } else {
        bcrypt.genSalt(saltRounds, function(err, salt) {
          bcrypt.hash(password, salt, function(err, hash) {
            console.log(hash);
            password = hash;

            var user = { email : email, password : password, first_name : firstName, last_name : lastName, phone : phone  };

            if (!email || !password || !firstName || !lastName || !phone) {
              connection.release();
              res.status(422).json( { "error" : "please provide all fields"} );
            } else {
              res.json( { "success" : true} );

              pool.getConnection(function(err, connection) {
                if (err) {
                  console.log(err);
                }

                connection.query('INSERT INTO _users SET ?', user, function(err, result) {
                  if (err) {
                    console.log(err);
                    connection.release();
                  } else {
                    //console.log(result);
                    connection.release();
                  }
                });

              });
            }

          });
        });
      }
    });
  });
});

module.exports = router;
