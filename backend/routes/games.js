const express = require("express");
const router = express.Router();
const headers = require("../headers");
const resultLimit = 50;

// Search for games based on search input query parameter
router.get("/", async (req, res) => {
    const searchInput = req.query.searchInput;
    const url = "https://api.igdb.com/v4/games/";
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: `fields name, cover.*; search "${searchInput}"; limit ${resultLimit};`,
    });
    res.status(200).json(await response.json());
});

// Retrieve game details for a game with a given id
router.get("/:id", async (req, res) => {
    const url = "https://api.igdb.com/v4/games/";
    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: `fields name, summary, cover.*, release_dates.*, genres.*, platforms.*, involved_companies.*, screenshots.*; where id=${req.params.id};`,
    });
    res.status(200).json(await response.json());
});

module.exports = router;