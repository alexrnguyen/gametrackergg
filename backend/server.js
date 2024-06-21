// Referenced: https://www.youtube.com/watch?v=5CFafWpWwxo&t=694s

const express = require("express");
const router = express.Router();
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
const Game = require("./models/Game.js");
const UserGameStatus = require("./models/UserGameStatus.js");

headers.append("Client-ID", config.clientID);
headers.append("Authorization", config.authorization);
router.get("/games", async (req, res) => {
  // Search for a games based on search input query parameter
  const searchInput = req.query.searchInput;
  const url = "https://api.igdb.com/v4/games/";
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: `fields name, cover.*; search "${searchInput}"; limit ${resultLimit};`,
  });
  res.status(200).json(await response.json());
});

router.get("/games/:id", async (req, res) => {
  const url = "https://api.igdb.com/v4/games/";
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: `fields name, summary, cover.*, release_dates.*, genres.*, platforms.*, involved_companies.*, screenshots.*; where id=${req.params.id};`,
  });
  res.status(200).json(await response.json());
});

router.get("/companies", async (req, res) => {
  const companies = req.query.company;
  const companiesTuple = `(${companies})`;

  if (companies === null) {
    res.status(400).send({message: "Must include company IDs as query parameters (e.g. 'company=1&company=2&company=3' for companies with IDs 1, 2, and 3)."})
  }

  const url = "https://api.igdb.com/v4/companies/";
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: `fields name; where id=${companiesTuple};`,
  });
  const data = await response.json();

  const companyNames = []
  for (const company of data) {
    companyNames.push({name: company.name});
  }

  res.status(200).json(companyNames);
});

// Get user's current status and rating for a game
router.get("/collection/:userId/game/:gameId", async (req, res) => {
  const userId = req.params.userId;
  const gameId = req.params.gameId;

  const gameStatus = await UserGameStatus.findOne({userId: userId, gameId: gameId});

  if (gameStatus === null) {
    res.status(404).send({status: null, rating: null});
  } else {
    res.status(200).send({status: gameStatus.status, rating: gameStatus.rating});
  }
});

// Remove a game's status from a user's collection
router.delete("/collection/:userId/game/:gameId/status/:status", async (req, res) => {
  const userId = req.params.userId;
  const gameId = req.params.gameId;
  const statusToDelete = req.params.status;
  const gameStatus = await UserGameStatus.findOne({userId: userId, gameId: gameId});

  if (gameStatus === null) {
    res.status(404).send();
  } else {
    if (gameStatus.status.length > 1) {
      // Remove status from list of statuses
      const index = gameStatus.status.indexOf(statusToDelete);
      gameStatus.status.splice(index, 1);
      await gameStatus.save();
      res.status(200).send();
    } else if (gameStatus.rating !== null) {
      // Set status to null (no status associated with game)
      gameStatus.status = null;
      await gameStatus.save();
      res.status(200).send();
    } else {
      // Delete game status from database (no rating or status associated with game for a particular user)
      await UserGameStatus.deleteOne({userId: userId, gameId: gameId});
      res.status(204).send();
    }
  }
});

// Get all games in a user's collection (can filter by status)
router.get("/collection/:userId", async (req, res) => {
  // Filter games by status if specified in query parameters
  const userId = req.params.userId;
  const status = req.query.status;
  let documents;

  if (status === undefined) {
    // Get all games in a user's collection
    documents = await UserGameStatus.find({userId: userId}).sort({rating: -1});

  } else {
    // Get all games with a specific status in a user's collection
    if (status !== "playing" && status !== "played" && status !== "backlog" && status !== "wishlist") {
      return res.status(400).send({message: "Status query parameter must be one of the following: playing, played, backlog, wishlist."});
    }
    documents = await UserGameStatus.find({userId: userId, status: status}).sort({rating: -1});
  }

  const queries = [];
  for(const document of documents) {
    const gameQuery = Game.findOne({gameId: document.gameId});
    queries.push(gameQuery);
  }
  const games = await Promise.all(queries);
  res.status(200).send(games);
})

// Add game to a user's collection
router.post("/collection/:userId", async (req, res) => {
  const userId = req.params.userId;
  const gameId = req.body.gameId;
  let status = req.body.status;
  const rating = req.body.rating; // possibly null

  const game = await Game.findOne({gameId: gameId});

  // Add game to database if it does not exist
  if (game === null) {
    // Get game name and cover from IGDB
    const url = "https://api.igdb.com/v4/games/";
    const gameResponse = await fetch(url, {
      method: "POST",
      headers: headers,
      body: `fields name, cover.*; where id=${gameId};`,
    });
    const data = (await gameResponse.json())[0];
    const gameToAdd = new Game({gameId: gameId, name: data.name, cover: data.cover.image_id});
    await gameToAdd.save();
  }

  // Check if the user already has a status associated with the game
  const existingGameStatus = await UserGameStatus.findOne({userId: userId, gameId: gameId});

  if (existingGameStatus === null) {
    const gameStatus = new UserGameStatus({userId, gameId, status, rating});
    await gameStatus.save();
    res.status(201).send();
  } else {
    console.log("new status");
    if (existingGameStatus.status === null) {
      existingGameStatus.status = [status];
    } else {
      existingGameStatus.status.push(status);
    }
    existingGameStatus.rating = rating;
    await existingGameStatus.save();
    res.status(200).send();
  }
});

// TODO: Change a game's status in a user's collection
router.put("/collection/:userId", async (req, res) => {

})

// TODO: Add rating to a game in a user's collection
router.post("/collection/:userId/rating", async (req, res) => {
  
});

// Change a game's rating in a user's collection
router.put("/collection/:userId/rating", async (req, res) => {
  const userId = req.params.userId;
  const gameId = req.body.gameId;
  const rating = req.body.rating;

  // Add game to database if it does not exist (REUSED CODE)
  const game = await Game.findOne({gameId: gameId});
  if (game === null) {
    // Get game name and cover from IGDB
    const url = "https://api.igdb.com/v4/games/";
    const gameResponse = await fetch(url, {
      method: "POST",
      headers: headers,
      body: `fields name, cover.*; where id=${gameId};`,
    });
    const data = (await gameResponse.json())[0];
    const gameToAdd = new Game({gameId: gameId, name: data.name, cover: data.cover.image_id});
    await gameToAdd.save();
  }

  // Check if the user already has a status associated with the game
  const existingGameStatus = await UserGameStatus.findOne({userId: userId, gameId: gameId});
  if (existingGameStatus === null) {
    const gameStatus = new UserGameStatus({userId, gameId, status: null, rating});
    await gameStatus.save();
    res.status(201).send();
  } else {
    // Add rating to the user's game status document
    existingGameStatus.rating = rating;
    await existingGameStatus.save();
    res.status(200).send();
  }

});

router.post("/signin", async (req, res) => {
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

})

router.post("/signup", (req, res) => {
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
      res.status(201).send();
    } catch (err) {
      // Handle duplicate key error (username and/or email exists in database)
      if (err && err.code === 11000) {
        res.status(400).send({message: "Username or email already taken!"});
      } else {
        res.status(500).send({message: "Internal server error! Please try again..."});
      }
    }
  })
})

app.use("/api/", router);

app.listen(PORT, async () => {
  console.log(`Listening on port ${PORT}`);
  await mongoose.connect(config.atlasURI).then(() => console.log("Connected to database")).catch((err) => console.log(err));
});
