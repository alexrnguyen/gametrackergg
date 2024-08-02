
// Convert game IDs to Game JSON objects
async function getGames(gameIds) {
    const promises = [];
  const url = "https://api.igdb.com/v4/games/";
  const headers = require("../headers.js");
  for (const gameId of gameIds) {
      const promise = fetch(url, {
          method: "POST",
          headers: headers,
          body: `fields name, cover.*, release_dates.*, platforms.*; where id=${gameId};`,
      });

      promises.push(promise);
  }

  const responses = await Promise.all(promises);
  const gameData = await Promise.all(responses.map(response => response.json()));

  // IGDB returns game as a single object in an array. The array must be flattened to get the Game object.
  const games = gameData.flat();

  return games;
}

module.exports = getGames;