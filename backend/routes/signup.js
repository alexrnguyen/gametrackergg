const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

// MongoDB Models
const User = require("../models/User.js");

// Create a new user
router.post("/", (req, res) => {
    console.log(req.body);
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
  
    if (username === undefined || email === undefined || password === undefined) {
      res.status(400).send({message: "Missing required field in request body (username, email, and/or password)"});
      return;
    }
    
    bcrypt.hash(password, 10, async function(err, hash) {
      if (err) {
        res.status(500).send({message: "Failed to register user. Please try again..."});
        return;
      }
      // Create new user
      const user = new User({username, email, password_hash: hash});
      try {
        await user.save();
        res.status(201).send({username: user.username, userId: user._id});
      } catch (err) {
        // Handle duplicate key error (username and/or email exists in database)
        if (err && err.code === 11000) {
          res.status(400).send({message: "Username or email already taken!"});
        } else {
          res.status(500).send({message: "Internal server error! Please try again..."});
        }
      }
    })
});

module.exports  = router;