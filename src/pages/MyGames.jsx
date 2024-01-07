import { useState } from "react";
import GameCard from "../components/GameCard";

const MyGames = () => {
  const [games, setGames] = useState([]);


  // Games are hardcoded for now
  return (
    <>
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