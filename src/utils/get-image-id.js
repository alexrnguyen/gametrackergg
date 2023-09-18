async function getImageId(gameId) {
  const imageId = await fetchImageId(gameId).catch((err) => console.log(err));
  return imageId;
}

async function fetchImageId(gameId) {
  /*fetch("http://localhost:5000/query-game-id", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parcel: gameId,
    }),
  });*/
  const response = await fetch("http://localhost:5000/get-cover", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      parcel: gameId,
    }),
  }).catch((err) => console.log(err));
  const data = await response.json();
  return data[0].image_id;
}

export default getImageId;
