import { useNavigate } from "react-router-dom";

const GameCard = ({gameId, imageId, title}) => {
    const navigate = useNavigate();
    function handleClick() {
        console.log("Clicked!")
        navigate(`/game/${gameId}`)
    }

    return (
        <div className="flex flex-col justify-center w-52 h-64" onClick={handleClick}>
            <img className="max-h-52 object-contain" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.png`} alt="" />
            <div className="card-game-title text-center">{title}</div>
        </div>
    )
}


export default GameCard;