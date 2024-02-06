import { useNavigate } from "react-router-dom";

const GameCard = ({gameId, imageId, title}) => {
    const navigate = useNavigate();
    function handleClick() {
        console.log("Clicked!")
        navigate(`/game/${gameId}`)
    }

    return (
        <div onClick={handleClick}>
            <img className="w-52 h-64 object-contain" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.png`} alt="" />
            <div className="card-game-title text-center">{title}</div>
        </div>
    )
}


export default GameCard;