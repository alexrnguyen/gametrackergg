import React, { useEffect } from "react";

const GameCard = ({imageId, title}) => {

    return (
        <div className="game-card">
            <img className="card-game-image" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.png`} alt="" />
            <div className="card-game-title">{title}</div>
        </div>
    )
}


export default GameCard;