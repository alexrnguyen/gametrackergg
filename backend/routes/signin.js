const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

// MongoDB Models
const User = require("../models/User.js");

// Authenticate user
router.post("/", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username === undefined || password === undefined) {
      return res.status(400).send({message: "Missing required field in request body (username, email, and/or password)"});
    }
  
    const user = await User.findOne({username: username});
  
    if (user !== null) {
      const hash = user.password_hash
      // Check that inputted password matches hash in the database
      const match = await bcrypt.compare(password, hash);
      if (match) {
        // successful login
        return res.status(200).send({username: user.username, userId: user._id});
      }
    } 
    // unsuccessful login
    res.status(401).send({message: "Username and/or password is incorrect"});
  
});

module.exports = router;