async function getImageId(gameId) {
  const imageId = await fetchImageId(gameId).catch((err) => console.log(err));
  return imageId;
}

async function fetchImageId(gameId) {
  const response = await fetch(`http://localhost:5000/cover/${gameId}`).catch(
    (err) => console.log(err)
  );
  const data = await response.json();
  console.log(gameId, data);
  if (data.length === 0) {
    return null;
  }
  setTimeout("", 200);
  return data[0].image_id;
}

export default getImageId;
