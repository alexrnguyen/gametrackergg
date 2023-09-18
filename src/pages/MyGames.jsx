import React, { useState } from "react";
import GameCard from "../components/GameCard";

const MyGames = () => {
  const [games, setGames] = useState([]);


  // Games are hardcoded for now
  return (
    <>
      <h1>My Games</h1>
      <ul className="games">
        {/*{games.length === 0 && "No Games"}
        {games.map(game => {
          return (
            <GameCard imageId={game.imageId} title={game.title}/>
          )
        })}*/}
        <GameCard imageId={"co1r76"} title={'Persona 5'}/>
        <GameCard imageId={"co1wyy"} title={'The Witcher 3: Wild Hunt'}/>
        <GameCard imageId={"co1r7f"} title={'The Last of Us'}/>
        <GameCard imageId={"co1r7h"} title={'Uncharted 4: A Thief\'s End'}/>
        <GameCard imageId={"co1n1x"} title={'Persona 4: Golden'}/>
        <GameCard imageId={"co1r76"} title={'Persona 5'}/>
        <GameCard imageId={"co1r76"} title={'Persona 5'}/>
        <GameCard imageId={"co1r76"} title={'Persona 5'}/>
        <GameCard imageId={"co1r76"} title={'Persona 5'}/>
        <GameCard imageId={"co1r76"} title={'Persona 5'}/>
        <GameCard imageId={"co1r76"} title={'Persona 5'}/>
        <GameCard imageId={"co1r76"} title={'Persona 5'}/>
        <GameCard imageId={"co1r76"} title={'Persona 5'}/>
        <GameCard imageId={"co1r76"} title={'Persona 5'}/>
      </ul>
    </>
  );
};

export default MyGames;