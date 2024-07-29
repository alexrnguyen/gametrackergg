import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import CategoryContainer from "../components/CategoryContainer";
import SortSelector from "../components/SortSelector";

const MyGames = () => {
  const userId = localStorage.getItem("userId");

  const [category, setCategory] = useState("played");
  const [gamesToDisplay, setGamesToDisplay] = useState([]);
  
  useEffect(() => {
    async function GetGames(userId, category) {
      const response = await fetch(`http://localhost:5000/api/collection/${userId}?status=${category}`);
      if (response.ok) {
        const games = await response.json();
        setGamesToDisplay(games);
        console.log(gamesToDisplay);
      }
    }

    GetGames(userId, category);
  }, [userId, category]);
  
  return (
    <>
      <div className="flex items-center gap-4 px-4 mt-4">
        <p>{gamesToDisplay.length} games</p>
        <div className="flex justify-between w-full">
          <CategoryContainer category={category} setCategory={setCategory}/>
        </div>
      </div>
      <ul className="grid grid-cols-auto-fill-200 place-items-center gap-4 py-2">
        {gamesToDisplay.length === 0 && "No Games"}
        {gamesToDisplay.map(game => {
          return (
            <>
              <GameCard key={game.gameId} gameId={game.gameId} imageId={game.cover} title={game.name}/>
            </>
          )
        })}
      </ul>
    </>
  );
};

export default MyGames;