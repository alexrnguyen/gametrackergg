const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameSchema = new Schema({
    gameId: {type: Number, required: true},
    name: String,
    cover: String
});

module.exports = mongoose.model("Game", GameSchema);