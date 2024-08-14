const env = require('dotenv').config({ path: '../.env' }).parsed;
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

// MongoDB Models
const User = require("../models/User.js");

// Create a new user
router.post("/", (req, res) => {
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

        // generate jwt
        const token = jwt.sign({id: user._id}, env.JWT_SECRET);

        res.status(201).send({username: user.username, userId: user._id, token});
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