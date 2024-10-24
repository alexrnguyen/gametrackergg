const mongoose = require("mongoose");
const review = require("./Review");

const ReviewSchema = review.schema;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password_hash: {type: String, required: true},
    favourite_games: [{type: Number, ref: "Game"}],
    pinned_reviews: [{type: ReviewSchema}],
    following: [{type: mongoose.Schema.ObjectId, ref: "User"}],
    followers: [{type: mongoose.Schema.ObjectId, ref: "User"}],
    profile_image_url: String
});

module.exports = mongoose.model("User", UserSchema);