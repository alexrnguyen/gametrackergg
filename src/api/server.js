// Referenced: https://www.youtube.com/watch?v=5CFafWpWwxo&t=694s

import express from "express";
const app = express();
import fetch from "node-fetch";
import cors from "cors";
import config from "../../config.js";

app.use(cors());
app.use(express.json());
console.log(config.clientID);
const PORT = process.env.PORT || 5000;
const resultLimit = 50;
var headers = new Headers();

headers.append("Client-ID", config.clientID);
headers.append("Authorization", config.authorization);
app.get("/search-results/:searchInput", async (req, res) => {
  const url = "https://api.igdb.com/v4/games/";
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: `fields name, cover.*; search "${req.params.searchInput}"; limit ${resultLimit};`,
  });
  res.status(200).json(await response.json());
});

app.get("/games/:id", async (req, res) => {
  const url = "https://api.igdb.com/v4/games/";
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: `fields name, summary, cover.*, release_dates.*, genres.*, platforms.*, involved_companies.*, screenshots.*; where id=${req.params.id};`,
  });
  res.status(200).json(await response.json());
});

app.get("/sign-out", (req, res) => {
  localStorage.setItem("username", null);
  res.redirect('/');
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
