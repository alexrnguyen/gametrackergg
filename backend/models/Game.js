const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameSchema = new Schema({
    id: {type: Number, required: true},
    name: {type: String, required: true},
    cover: String,
});

module.exports = mongoose.model("Game", GameSchema);