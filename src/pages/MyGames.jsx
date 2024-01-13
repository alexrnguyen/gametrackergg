import { useState } from "react";
import GameCard from "../components/GameCard";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Cake, PlayArrow, Queue, SportsEsports } from "@mui/icons-material";


const CategoryContainer = () => {

  const [category, setCategory] = useState('played');

  function handleChange(e, newCategory) {
    setCategory(newCategory);

    // TODO: Filter games based on category
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
  const [games, setGames] = useState([]);

  // Games are hardcoded for now
  return (
    <>
      <div className="flex items-center gap-4 px-4">
        {/* TODO: Make number displayed in <p> tag dynamic (i.e. change when category is changed) */}
        <p>14 games</p>
        <CategoryContainer/>
      </div>
      <ul className="grid grid-cols-auto-fill-200 place-items-center gap-4 py-2">
        {/*{games.length === 0 && "No Games"}
        {games.map(game => {
          return (
            <GameCard imageId={game.imageId} title={game.title}/>
          )
        })}*/}
        <GameCard gameId={9927} imageId={"co1r76"} title={'Persona 5'}/>
        <GameCard gameId={1942} imageId={"co1wyy"} title={'The Witcher 3: Wild Hunt'}/>
        <GameCard gameId={1009} imageId={"co1r7f"} title={'The Last of Us'}/>
        <GameCard gameId={7331} imageId={"co1r7h"} title={'Uncharted 4: A Thief\'s End'}/>
        <GameCard gameId={2985} imageId={"co1n1x"} title={'Persona 4: Golden'}/>
        <GameCard gameId={9927} imageId={"co1r76"} title={'Persona 5'}/>
        <GameCard gameId={9927} imageId={"co1r76"} title={'Persona 5'}/>
        <GameCard gameId={9927} imageId={"co1r76"} title={'Persona 5'}/>
        <GameCard gameId={9927} imageId={"co1r76"} title={'Persona 5'}/>
        <GameCard gameId={9927} imageId={"co1r76"} title={'Persona 5'}/>
        <GameCard gameId={9927} imageId={"co1r76"} title={'Persona 5'}/>
        <GameCard gameId={9927} imageId={"co1r76"} title={'Persona 5'}/>
        <GameCard gameId={9927} imageId={"co1r76"} title={'Persona 5'}/>
        <GameCard gameId={9927} imageId={"co1r76"} title={'Persona 5'}/>
      </ul>
    </>
  );
};

export default MyGames;