const express = require("express");
const router = express.Router();
const headers = require("../headers");

// MongoDB Models
const Game = require("../models/Game.js");
const UserGameStatus = require("../models/UserGameStatus.js");

// Get user's current status and rating for a game
router.get("/:userId/game/:gameId", async (req, res) => {
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
router.delete("/:userId/game/:gameId/status/:status", async (req, res) => {
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
router.get("/:userId", async (req, res) => {
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
router.post("/:userId", async (req, res) => {
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
router.put("/:userId", async (req, res) => {

})

// TODO: Add rating to a game in a user's collection
router.post("/:userId/rating", async (req, res) => {

});
  
// Change a game's rating in a user's collection
router.put("/:userId/rating", async (req, res) => {
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

  module.exports = router;