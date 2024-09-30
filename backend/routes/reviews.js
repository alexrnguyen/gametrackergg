const express = require("express");
const router = express.Router();
const isAuthorized = require("../auth.js");

// MongoDB Models
const User = require("../models/User.js");
const Game = require("../models/Game.js");
const Review = require("../models/Review.js");

// Create review
router.post('/', isAuthorized, async (req, res) => {
    const userId = req.body.userId;
    const gameId = req.body.gameId;
    const text = req.body.text;
    const dateCreated = new Date(); // in UTC

    // Verify that user and game exist in the database
    const user = await User.findById(userId);
    if (user === null) {
        return res.status(404).send("User not found");
    }

    const game = await Game.findOne({"gameId": gameId})
    if (game === null) {
        return res.status(404).send("Game not found");
    }

    const review = new Review({userId, gameId, text, dateCreated});
    await review.save(); // save review in database

    res.status(201).send({"reviewId": review.id});
});

// Get a review by ID
router.get("/:id", async (req, res) => {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);

    if (review === null) {
        return res.status(404).send("Review not found");
    }

    const user = await User.findById(review.userId);
    const game = await Game.findOne({"gameId": review.gameId});
    res.status(200).send({text: review.text, dateCreated: review.dateCreated, user, game});
});

// Edit a review with a given ID
router.put("/:id", isAuthorized, async (req, res) => {
    const reviewId = req.params.id;
    const editedText = req.body.text;

    const review = await Review.findById(reviewId);

    if (review === null) {
        return res.status(404).send("Review not found");
    }

    review.text = editedText;
    await review.save();

    res.status(200).send(review);
});

// Delete a review with a given ID
router.delete("/:id", isAuthorized, async (req, res) => {
    const reviewId = req.params.id;
    const reviewToDelete = await Review.findOneAndDelete({_id: reviewId});

    if (reviewToDelete === null) {
        return res.status(404).send("Review not found");
    }

    return res.status(204).send();
});

// TODO: Get review likes
router.get("/:id/likes", (req, res) => {

});

// TODO: Like a review
router.put("/:id/likes", isAuthorized, (req, res) => {

});



module.exports = router;