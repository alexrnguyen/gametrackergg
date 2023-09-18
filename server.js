// Referenced: https://www.youtube.com/watch?v=5CFafWpWwxo&t=694s

import express from "express";
const app = express();
import fetch from "node-fetch";
import cors from "cors";
import config from "./config.js";

app.use(cors());
app.use(express.json());
console.log(config.clientID);
const PORT = process.env.PORT || 5000;
const resultLimit = 10;
let searchInput = "";
//let gameId;
var headers = new Headers();

headers.append("Client-ID", "a6jf2zoshruhutnu1tktwuoo0diy5y");
headers.append("Authorization", "Bearer 99soojy3jf0i6rpafexh1j9yu982q4");
headers.append("Content-Type", "application/json");
app.get("/", async (req, res) => {
  const url = "https://api.igdb.com/v4/games/";
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: `fields name; search "${searchInput}"; limit ${resultLimit};`,
  });
  res.json(await response.json());
});

app.post("/", (req, res) => {
  console.log(req.body);
  searchInput = req.body.parcel;
});

app.post("/query-game-id", (req, res) => {
  console.log(req.body);
  //gameId = req.body.parcel;
});

app.post("/get-cover", async (req, res) => {
  const gameId = req.body.parcel;
  const url = "https://api.igdb.com/v4/covers/";
  console.log(`Get cover ${gameId}`);
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: `fields game, image_id; where game=${gameId};`,
  });
  res.json(await response.json());
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
