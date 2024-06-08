// Referenced: https://www.youtube.com/watch?v=5CFafWpWwxo&t=694s

const express = require("express");
const cors = require("cors");
const config = require("./config.js")

const app = express();
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

app.get("/companies/:id", async (req, res) => {
  const url = "https://api.igdb.com/v4/companies/";
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: `fields name; where id=${req.params.id};`,
  });
  const data = await response.json();
  res.status(200).json({name: data[0].name});
})

app.get("/sign-out", (req, res) => {
  localStorage.setItem("username", null);
  res.redirect('/');
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
