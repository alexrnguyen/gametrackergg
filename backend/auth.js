const env = require('dotenv').config({ path: '../.env' }).parsed;
const jwt = require('jsonwebtoken');

const User = require("./models/User.js");

// Authorize a user based on whether a valid access token is provided in the request
async function isAuthorized(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        // User is not authenticated
        return res.redirect("http://localhost:5173/sign-in");
    }

    const secret = env.JWT_SECRET;

    try{
        // Verify token
        const decode = jwt.verify(token, secret);
        const userId = decode.id;

        // Get User from database based on ID corresponding to token
        const user = await User.findById(userId);
        req.user = user;
        next(); // send data (user ID and time issued in UNIX time)

    } catch (err) {
        if (err.name === "JsonWebTokenError") {
            // Invalid token, prompt user to sign in
            return res.redirect("http://localhost:5173/sign-in");
        }
        res.status(500).send({message: "Internal server error"});
    }
}

module.exports = isAuthorized;