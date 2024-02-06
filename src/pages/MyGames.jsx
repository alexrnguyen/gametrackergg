import { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import GameCard from "../components/GameCard";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Cake, PlayArrow, Queue, SportsEsports } from "@mui/icons-material";


const CategoryContainer = (props) => {

  CategoryContainer.propTypes = {
    category: PropTypes.string.isRequired,
    setCategory: PropTypes.func.isRequired
  }

  const {category, setCategory} = props;

  function handleChange(e, newCategory) {
    if (newCategory !== null) {
      setCategory(newCategory);
    }
  }

  return (
      <ToggleButtonGroup 
        className="flex gap-4" 
        value={category}
        defaultValue='played'
        exclusive 
        onChange={handleChange}
        >
          <ToggleButton value="played" className="flex flex-col items-center" size="small">
            <SportsEsports id="played-icon" color="success"/>
            <p>Played</p>
          </ToggleButton>
          <ToggleButton value="playing" className="flex flex-col items-center" size="small">
            <PlayArrow id="playing-icon" color="error"/>
            <p>Playing</p>
          </ToggleButton>
          <ToggleButton value="backlog" className="flex flex-col items-center" size="small">
            <Queue id="backlog-icon" color="info"/>
            <p>Backlog</p>
          </ToggleButton>
          <ToggleButton value="wishlist" className="flex flex-col items-center" size="small">
            <Cake id="wishlist-icon" color="warning"/>
            <p>Wishlist</p>
          </ToggleButton>
      </ToggleButtonGroup>
  )
}

const MyGames = () => {
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
    }
  ]);

  const [category, setCategory] = useState("played");

  const [gamesToDisplay, setGamesToDisplay] = useState(games.current.filter(game => game.userCategory === category));
  
  useEffect(() => {
    setGamesToDisplay(games.current.filter(game => game.userCategory === category))
  }, [category])
  // Games are hardcoded for now
  return (
    <>
      <div className="flex items-center gap-4 px-4">
        {/* TODO: Make number displayed in <p> tag dynamic (i.e. change when category is changed) */}
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