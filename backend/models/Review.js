const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// TODO: Add likes
const ReviewSchema = new Schema({
    userId: {type: mongoose.Schema.ObjectId, ref: "User", required: true},
    gameId: {type: Number, ref: "Game", required: true},
    text: {type: String, required: true},
    dateCreated: {type: Date}
});

module.exports = mongoose.model("Review", ReviewSchema);