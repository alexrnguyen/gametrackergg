const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserGameStatusSchema = new Schema({
    userId: {type: mongoose.Schema.ObjectId, ref: "User", required: true},
    gameId: {type: Number, ref: "Game", required: true},
    status: {type: String, enum: ['playing', 'played', 'backlog', 'wishlist']},
    rating: Number
});

UserGameStatusSchema.index({"userId": 1, "gameId": 1}, {unique: true});

module.exports = mongoose.model("UserGameStatus", UserGameStatusSchema);

