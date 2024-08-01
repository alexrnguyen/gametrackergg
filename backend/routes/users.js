const express = require("express");
const router = express.Router();

// MongoDB Models
const User = require("../models/User.js");
const Review = require("../models/Review.js");

const FAVOURITE_GAMES_LIMIT = 4;

// Convert user IDs to User objects
async function getUsers(userIds) {
    if (userIds.length === 0) {
        return [];
    }

    const promises = [];
    for (const userId of userIds) {
        const promise = User.findById(userId);
        promises.push(promise);
    }

    const users = await Promise.all(promises);

    // Get rid of null user objects (users who were not found in the database)
    return users.filter(user => user !== null);
}

// Get user details
router.get("/:id", async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (user === null) {
        return res.status(404).send("User not found");
    }

    res.status(200).send({id: user._id, username: user.username, favouriteGames: user.favourite_games, following: user.following, followers: user.followers});
});

// Get all user reviews
router.get("/:id/reviews", async (req, res) => {
    const userId = req.params.id;

    const user = await User.findById(userId);

    // Verify that user exists
    if (user === null) {
        return res.status(404).send("User not found");
    }
    
    const reviewsData = await Review.find({'userId': userId});
    const reviews = reviewsData.map(reviewData => reviewData.toObject());

    // TODO: Get game details for each review
    const promises = [];
    const url = "https://api.igdb.com/v4/games/";
    const headers = require("../headers");
    for (const review of reviews) {
        const promise = fetch(url, {
            method: "POST",
            headers: headers,
            body: `fields name, cover.*, release_dates.*, platforms.*; where id=${review.gameId};`,
        });

        promises.push(promise);
    }

    const responses = await Promise.all(promises);
    const data = await Promise.all(responses.map(response => response.json()));
    const games = data.flat();

    for (let i = 0; i < reviews.length; i++) {
        reviews[i] = {...reviews[i], game: games[i]};
    }
    return res.status(200).send(reviews);
});

// Get all users a user follows
router.get("/:id/following", async (req, res) => {
    const userId = req.params.id;

    const user = await User.findById(userId);

    // Verify that user exists
    if (user === null) {
        return res.status(404).send("User not found");
    }

    // Get User objects from array of IDs in user.following
    const following = await getUsers(user.following)
    return res.status(200).send(following);
});

// Get all followers
router.get("/:id/followers", async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);

    // Verify that user exists
    if (user === null) {
        return res.status(404).send("User not found");
    }

    // Get User objects from array of IDs in user.followers
    const followers = await getUsers(user.followers)
    return res.status(200).send(followers);
});

// Get user's favourite games
router.get("/:id/favourites", async (req, res) => {
    const userId = req.params.id;

    const user = await User.findById(userId);

    // Verify that user exists
    if (user === null) {
        return res.status(404).send("User not found");
    }

    res.status(200).send(user.favourite_games);
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

    // Prevent users from adding more than the limit of favourite games
    if (user.favourite_games.length >= FAVOURITE_GAMES_LIMIT) {
        return res.status(400).send(`Can only have at most ${FAVOURITE_GAMES_LIMIT} games marked as favourites`);
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