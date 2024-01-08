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
const resultLimit = 10;
var headers = new Headers();

headers.append("Client-ID", config.clientID);
headers.append("Authorization", config.authorization);
headers.append("Content-Type", "application/json");
app.get("/search-results/:searchInput", async (req, res) => {
  const url = "https://api.igdb.com/v4/games/";
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: `fields name; search "${req.params.searchInput}"; limit ${resultLimit};`,
  });
  res.status(200).json(await response.json());
});

app.get("/game/:gameId", async (req, res) => {
  const url = "https://api.igdb.com/v4/games/";
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: `fields name, summary, release_dates; where id=${req.params.gameId};`,
  });
  res.status(200).json(await response.json());
});

app.get("/year/:dateId", async (req, res) => {
  const url = "https://api.igdb.com/v4/release_dates/";
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: `fields y; where id=${req.params.dateId};`,
  });
  const data = await response.json();
  res.status(200).json(data[0]);
});

app.get("/cover/:gameId", async (req, res) => {
  const url = "https://api.igdb.com/v4/covers/";
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: `fields game, image_id; where game=${req.params.gameId};`,
  });
  res.status(200).json(await response.json());
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
