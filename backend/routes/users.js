const express = require("express");
const getUsers = require("../utils/getUsers.js");
const getGames = require("../utils/getGames.js");
const isAuthorized = require("../middleware/auth.js");
const router = express.Router();

// MongoDB Models
const User = require("../models/User.js");
const Review = require("../models/Review.js");
const Notification = require("../models/Notification.js");
const Game = require("../models/Game.js");
const UserGameStatus = require("../models/UserGameStatus.js");

// Constants
const FAVOURITE_GAMES_LIMIT = 4;
const PINNED_REVIEW_LIMIT = 2;


// Get user details
router.get("/:id", async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (user === null) {
        return res.status(404).send("User not found");
    }

    res.status(200).send({_id: user._id, username: user.username, favouriteGames: user.favourite_games, following: user.following, followers: user.followers, profileImageURL: user.profile_image_url});
});

// Get all user reviews
router.get("/:id/reviews", async (req, res) => {
    // TODO: Add page and size parameters to this endpoint
    const userId = req.params.id;
    const sortCriterion = req.query.sortBy;

    const user = await User.findById(userId);

    // Verify that user exists
    if (user === null) {
        return res.status(404).send("User not found");
    }

    // Sort reviews if sort criterion is given
    // TODO: Fix case where user has reviewed game without rating it (move rating to Review model)
    let reviewsData;
    if (sortCriterion) {
        switch (sortCriterion) {
          case "date": {
            // sort by date reviewed
            reviewsData = await Review.find({'userId': userId}).sort({'dateCreated': -1});
            break;
          }
          case "rating": {
            // sort by user rating
            const gameStatuses = await UserGameStatus.find({'userId': userId}).sort({'rating': -1});
            const gameIds = gameStatuses.map(status => status.gameId || null);
            const queries = [];
            for (const gameId of gameIds) {
                const gameQuery = Review.findOne({gameId: gameId, userId: userId});
                queries.push(gameQuery);
            }
            reviewsData = await Promise.all(queries); // get all ratings
            reviewsData = reviewsData.filter(review => review !== null); // remove results with no reviews
            break;
          }
          default: {
            // sort by name (alphabetical)
            const unsortedReviews = await Review.find({'userId': userId})
            const gameIds = unsortedReviews.map(status => status.gameId || null);
            const games = await Game.find({gameId: { "$in": gameIds} }).sort("name");
            const queries = [];
            for (const game of games) {
                const gameQuery = Review.findOne({gameId: game.gameId, userId: userId});
                queries.push(gameQuery);
            }
            reviewsData = await Promise.all(queries);
          }
        }
    } else {
        reviewsData = await Review.find({'userId': userId});
    }
    const reviews = reviewsData.map(reviewData => reviewData.toObject());

    // Get game details for each review
    const gameIds = reviews.map(review => review.gameId);
    const games = await getGames(gameIds);

    for (let i = 0; i < reviews.length; i++) {
        reviews[i] = {...reviews[i], game: games[i], user};
    }
    return res.status(200).send(reviews);
});

// Get pinned user reviews
router.get("/:id/reviews/pinned", async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);

    // Verify that user exists
    if (user === null) {
        return res.status(404).send("User not found");
    }

    // Get copy of pinnedReviews
    const pinnedReviewsData = user.pinned_reviews.slice();
    const pinnedReviews = pinnedReviewsData.map(review => review._doc);

    // Get game details for each review
    const gameIds = pinnedReviews.map(review => review.gameId);
    const games = await getGames(gameIds);
    for (let i = 0; i < pinnedReviews.length; i++) {
        pinnedReviews[i] = {...pinnedReviews[i], game: games[i], user};
    }
    return res.status(200).send(pinnedReviews);
});

// Add a review to pinned reviews
router.post("/:id/reviews/pin/:reviewId", isAuthorized, async (req, res) => {
    const userId = req.params.id;
    const reviewId = req.params.reviewId;

    const user = await User.findById(userId);

    if (user === null) {
        return res.status(404).send("User not found");
    }

    const review = await Review.findById(reviewId);

    if (review === null) {
        return res.status(404).send("Review not found");
    }

    if (user.pinned_reviews.length >= PINNED_REVIEW_LIMIT) {
        return res.status(400).send("Maximum pinned reviews reached (4)");
    }

    user.pinned_reviews.push(review);
    await user.save();
    return res.status(200).send();
});

// Remove a review from pinned reviews (unpin)
router.delete("/:id/reviews/pin/:reviewId", isAuthorized, async (req, res) => {
    const userId = req.params.id;
    const reviewId = req.params.reviewId;

    const user = await User.findById(userId);

    if (user === null) {
        return res.status(404).send("User not found");
    }

    const review = await Review.findById(reviewId);

    if (review === null) {
        return res.status(404).send("Review not found");
    }

    const reviewIds = user.pinned_reviews.map(review => review._id.toString());
    if (!reviewIds.includes(review._id.toString())) {
        return res.status(400).send("Review not pinned by user");
    }

    const indexOfReview = user.pinned_reviews.indexOf(review);
    user.pinned_reviews.splice(indexOfReview, 1);
    await user.save();
    res.status(204).send();
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
router.post("/:id/favourites", isAuthorized, async (req, res) => {
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
router.delete("/:id/favourites/:gameId", isAuthorized, async (req, res) => {
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

// Check if a user follows another user
router.get("/:id1/follows/:id2", async (req, res) => {
    const userId1 = req.params.id1;
    const userId2 = req.params.id2;

    const user1 = await User.findById(userId1);

    if (user1.following.includes(userId2)) {
        return res.status(200).send(`User with id ${userId1} follows user with id ${userId2}`);
    }

    return res.status(404).send(`User with id ${userId1} does not follow user with id ${userId2}`);
});

// Follow another user
router.post("/:senderId/follow/:recipientId", isAuthorized, async (req, res) => {
    const senderId = req.params.senderId;
    
    if (senderId !== req.user._id.toString()) {
        return res.status(403).send();
    }

    const recipientId = req.params.recipientId;

    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (sender === null) {
        return res.status(404).send("Sender not found");
    } else if (recipient === null) {
        return res.status(404).send("Recipient not found");
    }


    if (recipient.followers.includes(senderId)) {
        return res.status(200).send(`User with id ${senderId} already follows user with id ${recipientId}`);
    }

    recipient.followers.push(senderId);
    sender.following.push(recipientId);
    await recipient.save();
    await sender.save();

    res.status(200).send();
});


// Unfollow another user
router.delete("/:senderId/follow/:recipientId", isAuthorized, async (req, res) => {
    // TODO: Code below is repeated from follow user endpoint (refactor into a function)
    const senderId = req.params.senderId;

    if (senderId !== req.user._id.toString()) {
        return res.status(403).send();
    }

    const recipientId = req.params.recipientId;

    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    if (sender === null) {
        return res.status(404).send("Sender not found");
    } else if (recipient === null) {
        return res.status(404).send("Recipient not found");
    }

    if (!sender.following.includes(recipientId)) {
        return res.status(404).send(`User with id ${senderId} does not follow user with id ${recipientId}`);
    }

    recipient.followers.splice(recipient.followers.indexOf(senderId), 1);
    sender.following.splice(sender.following.indexOf(recipientId), 1);
    await recipient.save();
    await sender.save();

    res.status(204).send();
});

// Get all user notifications
router.get("/:id/notifications", isAuthorized, async (req, res) => {
    const userId = req.params.id;
    const notifications = await Notification.find({'recipientUserId': userId});

    res.status(200).send(notifications);
});

// Create a new notification
router.post("/:id/notifications", isAuthorized, async (req, res) => {
    const actionUserId = req.body.actionUserId;
    const recipientUserId = req.params.id;
    const action = req.body.action;
    const gameId = req.body.gameId;
    const dateCreated = new Date(); // in UTC

    const actionUser = await User.findById(actionUserId);
    if (actionUser === null) {
        return res.status(404).send("Action user not found");
    }

    const recipientUser = await User.findById(recipientUserId);
    if (recipientUser === null) {
        return res.status(404).send("Recipient user not found");
    }

    if (!gameId && action !== "follow") {
        return res.status(400).send("Missing gameId in request body");
    }
    const game = await Game.find({"gameId": gameId});

    let text;
    switch(action) {
        case "follow":
            text = `${actionUser.username} is now following you`;
            break;
        case "review":
            text = `${actionUser.username} reviewed ${game.name}`;
            break;
        case "comment":
            text = `${actionUser.username} commented on your review`;
            break;

        case "like":
            text = `${actionUser.username} liked your review`;
            break;

        case "playing":
            text = `${actionUser.username} is now playing ${game.name}`;
            break;

        case "played":
            text = `${actionUser.username} played ${game.name}`;
            break;

        case "backlog":
            text = `${actionUser.username} added ${game.name} to their backlog`;
            break;

        case "wishlist":
            text = `${actionUser.username} added ${game.name} to their wishlist`;
            break;
        default:
            return res.status(400).send("Invalid action parameter given in request body. The action parameter must be one of the following: follow, review, comment, like, playing, played, backlog, wishlist");
    }

    let notification;
    if (gameId) {
        const game = await Game.find({"gameId": gameId});
        notification = new Notification({action, actionUserId, recipientUserId, text, game, dateCreated});
    } else {
        notification = new Notification({action, actionUserId, recipientUserId, text, dateCreated});
    }
    await notification.save();
    res.status(201).send(notification);
});

module.exports = router;