const express = require("express");
const router = express.Router();

// MongoDB Models
const User = require("../models/User.js");
const Game = require("../models/Game.js");

// Get user details
router.get("/:id", async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (user === null) {
        return res.status(404).send("User not found");
    }

    res.status(200).send({username: user.username, favouriteGames: user.favourite_games, following: user.following, followers: user.followers});
});

// Add game to favourite games
router.post("/:id/favourites", async (req, res) => {
    const userId = req.params.id;
    const gameId = req.body.gameId;

    const user = await User.findById(userId);

    // Verify that user exists
    if (user === null) {
        return res.status(404).send("User not found");
    }

    // Check if game is already in favourites
    if (user.favourite_games.includes(gameId)) {
        return res.status(400).send("Game already in favourites");
    }

    user.favourite_games.push(gameId);
    await user.save();

    res.status(200).send();

});

// Remove game from favourite games
router.delete("/:id/favourites/:gameId", async (req, res) => {
    const userId = req.params.id;
    const gameId = req.params.gameId;

    const user = await User.findById(userId);

    // Verify that user exists
    if (user === null) {
        return res.status(404).send("User not found");
    }

    // Check if game is already in favourites
    if (!user.favourite_games.includes(gameId)) {
        return res.status(404).send("Game is not in favourites");
    }

    const indexOfGame = user.favourite_games.indexOf(gameId);
    user.favourite_games.splice(indexOfGame, 1);
    await user.save();

    res.status(204).send();


});

module.exports = router;