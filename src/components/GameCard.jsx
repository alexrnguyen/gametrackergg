import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GameCard = ({gameId, imageId, title}) => {
    const navigate = useNavigate();
    function handleClick() {
        console.log("Clicked!")
        navigate(`/game/${gameId}`)
    }

    return (
        <div onClick={handleClick} className="game-card">
            <img className="card-game-image" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.png`} alt="" />
            <div className="card-game-title">{title}</div>
        </div>
    )
}


export default GameCard;