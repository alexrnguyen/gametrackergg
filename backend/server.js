// Referenced: https://www.youtube.com/watch?v=5CFafWpWwxo&t=694s

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const config = require("./config.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

console.log(config.clientID);
const PORT = process.env.PORT || 5000;
const resultLimit = 50;
var headers = new Headers();

// MongoDB Models
const User = require("./models/User.js");

headers.append("Client-ID", config.clientID);
headers.append("Authorization", config.authorization);
app.get("/search-results/:searchInput", async (req, res) => {
  const url = "https://api.igdb.com/v4/games/";
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: `fields name, cover.*; search "${req.params.searchInput}"; limit ${resultLimit};`,
  });
  res.status(200).json(await response.json());
});

app.get("/games/:id", async (req, res) => {
  const url = "https://api.igdb.com/v4/games/";
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: `fields name, summary, cover.*, release_dates.*, genres.*, platforms.*, involved_companies.*, screenshots.*; where id=${req.params.id};`,
  });
  res.status(200).json(await response.json());
});

app.get("/companies/:id", async (req, res) => {
  const url = "https://api.igdb.com/v4/companies/";
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: `fields name; where id=${req.params.id};`,
  });
  const data = await response.json();
  res.status(200).json({name: data[0].name});
})

app.post("/signup", (req, res) => {
  console.log(req.body);
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  if (username === undefined || email === undefined || password === undefined) {
    res.status(400).send({message: "Missing required field in request body (username, email, and/or password)"});
    return;
  }
  

  bcrypt.hash(password, 10, function(err, hash) {
    if (err) {
      res.status(500).send({message: "Failed to register user."});
      return;
    }
    const user = new User({username, email, password_hash: hash});
    user.save();
    res.status(201).redirect('/');
  })
})

app.get("/sign-out", (req, res) => {
  localStorage.setItem("username", null);
  res.redirect('/');
})

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
  await mongoose.connect(config.atlasURI).then(() => console.log("Connected to database")).catch((err) => console.log(err));
});
