const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password_hash: {type: String, required: true},
    favourite_games: [{type: mongoose.Schema.ObjectId, ref: "Game"}],
    following: [{type: mongoose.Schema.ObjectId, ref: "User"}],
    followers: [{type: mongoose.Schema.ObjectId, ref: "User"}]
});

module.exports = mongoose.model("User", UserSchema);