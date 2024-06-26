const express = require("express");
const router = express.Router();
const headers = require("../headers");
const resultLimit = 50;

// MongoDB Models
const UserGameStatus = require("../models/UserGameStatus.js");

// Search for games based on search input query parameter
router.get("/", async (req, res) => {
    const searchInput = req.query.searchInput;
    const url = "https://api.igdb.com/v4/games/";
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: `fields name, cover.*; search "${searchInput}"; limit ${resultLimit};`,
    });
    res.status(200).json(await response.json());
});

// Retrieve game details for a game with a given id
router.get("/:id", async (req, res) => {
    const url = "https://api.igdb.com/v4/games/";
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: `fields name, summary, cover.*, release_dates.*, genres.*, platforms.*, involved_companies.*, screenshots.*; where id=${req.params.id};`,
    });
    res.status(200).json(await response.json());
});

// Retrieve all ratings for a game (including average rating)
router.get("/:id/ratings", async (req, res) => {
  const gameId = req.params.id;
  const gameRatingsData = await UserGameStatus.find({gameId: gameId, 'rating': {$ne : null}}).select("-_id rating");

  if (gameRatingsData === null) {
    res.status(404).send("No ratings found");
  }
  const ratings = gameRatingsData.map(data => data.rating);

  // Get average rating rounded to the nearest tenth
  const averageRating = Math.round(ratings.reduce((partialSum, a) => partialSum + a , 0) / ratings.length * 10) / 10;

  // Create an object containing the number of ratings for each star increment
  const numRatings = {};
  for (const rating of ratings) {
    numRatings[rating] ? numRatings[rating] += 1 : numRatings[rating] = 1;
  }

  // Fill possible ratings (from 1/2 star to 5 stars) with 0s if necessary
  const possibleRatings = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  for (const rating of possibleRatings) {
    if (numRatings[rating] === undefined) {
      numRatings[rating] = 0;
    }
  }

  res.status(200).send({averageRating: averageRating, ratings: numRatings});
});

module.exports = router;