require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
//let encrypt = require('mongoose-encryption');
// const md5 = require("md5");
const bcrypt = require("bcrypt");

const saltRounds = 5;

const app = express();
//console.log(process.env.API_KEY);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

//Lines 26-29 secret and Security level 1 - masking key
// let secret = "Thisisourlittlesecret!.";
//
// //encrypt specific fields
// userSchema.plugin(encrypt, { secret: secret, encryptedFields:["password"] });

// Environment Vars Secret
//userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:["password"] });

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home")
})
app.get("/login", function(req, res) {
  res.render("login")
})
app.get("/register", function(req, res) {
  res.render("register")
})

app.post("/register", function(req, res) {

 bcrypt.hash(req.body.password,saltRounds,function(err,hash){
   const newUser = new User({
     email: req.body.username,
     password: hash
   });

  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets")
    }
  });
});
});
app.post("/login", function(req, res) {
  const userName = req.body.username;
  const password = req.body.password;
  User.findOne({
    email: userName
  }, function(err, foundUser) {
    if (!err) {
      bcrypt.compare(password,foundUser.password,function(err,result){
        if(result === true){
          res.render("secrets");
        }else{
          //console.log(err);
          res.send("Password mismatch");
        }
      })}
      else {
        //console.log(err);
        res.send("Password mismatch");
      }
    })
  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
