const express = require("express");
const { ImgurClient } = require('imgur');
const router = express.Router();
const client = new ImgurClient({ accessToken: process.env.IMGUR_ACCESS_TOKEN });
const isAuthorized = require("../middleware/auth.js");

// MongoDB Models
const User = require("../models/User.js");

router.put("/:uid/upload", isAuthorized, async (req, res) => {
    const userId = req.params.uid;
    const user = await User.findById(userId);
    if (user === null) {
        return res.status(404).send("User not found");
    }

    // Check if the request body contains a base64 string representation of the image to upload
    const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    const base64String = req.body;
    if (!base64Regex.test(base64String)) {
        return res.status(400).send("Request body must be a base64 string");
    }

    // Upload image to Imgur
    const response = await client.upload({
        image: base64String,
        type: 'base64',
    });
    console.log(response);
    if (response.status === 200) {
        // Change the user's profile picture to the image URL uploaded to Imgur
        user.profile_image_url = response.data.link;
        await user.save();
        return res.status(200).send({url: response.data.link, deleteHash: response.data.deletehash })
    } else {
        // TODO: Handle failed upload
        return res.status(500).send("Failed to upload image");
    }
});

module.exports = router;