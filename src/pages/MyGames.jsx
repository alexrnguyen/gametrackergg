import { useEffect, useRef, useState } from "react";
import GameCard from "../components/GameCard";
import CategoryContainer from "../components/CategoryContainer";

const MyGames = () => {
  // Temporary data
  const games = useRef([
    {
      gameId: 9927,
      imageId: "co1r76",
      title: "Persona 5",
      userCategory: "played"
    }, 
    {
      gameId: 1942,
      imageId: "co1wyy",
      title: "The Witcher 3: Wild Hunt",
      userCategory: "played"
    },
    {
      gameId: 1009,
      imageId: "co1r7f",
      title: "The Last of Us",
      userCategory: "played"
    },
    {
      gameId: 217590,
      imageId: "co7lbb",
      title: "Tekken 8",
      userCategory: "wishlist"
    },
    {
      gameId: 132181,
      imageId: "co6bo0",
      title: "Resident Evil 4",
      userCategory: "backlog"
    }
  ]);

  const [category, setCategory] = useState("played");
  const [gamesToDisplay, setGamesToDisplay] = useState(games.current.filter(game => game.userCategory === category));
  
  useEffect(() => {
    setGamesToDisplay(games.current.filter(game => game.userCategory === category))
  }, [category])
  return (
    <>
      <div className="flex items-center gap-4 px-4">
        <p>{gamesToDisplay.length} games</p>
        <CategoryContainer
          category={category}
          setCategory={setCategory}
        />
      </div>
      <ul className="grid grid-cols-auto-fill-200 place-items-center gap-4 py-2">
        {gamesToDisplay.length === 0 && "No Games"}
        {gamesToDisplay.map(game => {
          return (
            <>
              <GameCard key={game.gameId} gameId={game.gameId} imageId={game.imageId} title={game.title}/>
            </>
          )
        })}
      </ul>
    </>
  );
};

export default MyGames;