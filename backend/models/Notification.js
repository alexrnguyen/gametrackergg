const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    action: [{type: String, enum: ['review', 'comment', 'like', 'follow', 'playing', 'played', 'backlog', 'wishlist'], required: true}],
    actionUserId: {type: mongoose.Schema.ObjectId, ref: "User", required: true},
    recipientUserId: {type: mongoose.Schema.ObjectId, ref: "User", required: true},
    text: {type: String, required: true},
    gameId: {type: mongoose.Schema.ObjectId, ref: "Game"},
    reviewId: {type: mongoose.Schema.ObjectId, ref: "Review"},
    dateCreated: {type: Date}
});

module.exports = mongoose.model("Notification", NotificationSchema);