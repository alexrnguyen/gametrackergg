import { useState } from "react";
import { useNavigate} from "react-router-dom";

// Displays game cover and title
const GameCard = ({gameId, imageId, title}) => {

    const [isHovering, setIsHovering] = useState(false);

    const navigate = useNavigate();
    function handleClick() {
        console.log("Clicked!")
        navigate(`/game/${gameId}`)
    }

    function handleMouseOver() {
        setIsHovering(true);
    }

    function handleMouseOut() {
        setIsHovering(false);
    }

    return (
        <div className="relative hover:border-1 hover:border-red hover:rounded-lg" onClick={handleClick} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <img className="max-h-52 object-contain rounded-md" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.png`} alt={`${title} Cover`} />
            {isHovering && <div className="game-card-title">{title}</div>}
        </div>
    )
}


export default GameCard;