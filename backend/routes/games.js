const express = require("express");
const getUsers = require("../utils/getUsers.js");
const getGames = require("../utils/getGames.js");
const router = express.Router();
const headers = require("../headers");
const resultLimit = 48;

// MongoDB Models
const UserGameStatus = require("../models/UserGameStatus.js");
const Review = require("../models/Review.js");

// Search for games based on search input query parameter
router.get("/", async (req, res) => {
    const searchInput = req.query.searchInput;
    const page = req.query.page;
    const url = "https://api.igdb.com/v4/games/";

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: `fields name, cover.*, release_dates.*, platforms.*; search "${searchInput}"; limit ${resultLimit}; offset ${(page-1)*resultLimit};`,
    });

    const games = await response.json();
    
    // Get number of games (for pagination)
    const count = response.headers.get("x-count");
    const numPages = Math.ceil(count / resultLimit);

    res.status(200).json({games, numPages, count});
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
  if (gameRatingsData.length === 0) {
    return res.status(404).send("No ratings found");
  }
  const ratings = gameRatingsData.map(data => data.rating);

  // Get average rating rounded to the nearest tenth
  const averageRating = Math.round(ratings.reduce((partialSum, a) => partialSum + a , 0) / ratings.length * 10) / 10;

  // Create an object containing the number of ratings for each star increment
  const numRatings = {};
  for (const rating of ratings) {
    numRatings[rating] ? numRatings[rating] += 1 : numRatings[rating] = 1;
  }

  // Create dataset containing an array of objects with the number of ratings and the rating itself
  const ratingsDataset = [];
  const possibleRatings = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
  for (const rating of possibleRatings) {
    if (numRatings[rating] === undefined) {
      ratingsDataset.push({'rating': rating, 'numRatings': 0});
    } else {
      ratingsDataset.push({'rating': rating, 'numRatings': numRatings[rating]});
    }
  }

  res.status(200).send({averageRating: averageRating, ratings: ratingsDataset});
});

// Get all reviews for a game
router.get("/:id/reviews", async (req, res) => {
  // TODO: Add page and size parameters to this endpoint
  const gameId = req.params.id;

  const reviewsData = await Review.find({'gameId': gameId});
  const reviews = reviewsData.map(reviewData => reviewData.toObject());

  if (reviews.length === 0) {
    return res.status(404).send(`No reviews found for game with id ${gameId}`);
  }

  // Get user documents from user IDs
  const userIds = reviews.map(review => review.userId);
  const users = await getUsers(userIds);

  for (let i = 0; i < reviews.length; i++) {
    reviews[i] = {...reviews[i], user: users[i]};
  }

  // Get game details for each review
  const gameIds = reviews.map(review => review.gameId);
  const games = await getGames(gameIds);

  for (let i = 0; i < reviews.length; i++) {
      reviews[i] = {...reviews[i], game: games[i]};
  }
  res.status(200).send(reviews);
});

module.exports = router;