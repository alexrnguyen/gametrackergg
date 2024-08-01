import { Rating } from "@mui/material";
import ProfilePic from "../assets/test-profile-pic.jpg"
import { useEffect, useState } from "react";

const ReviewCard = ({id, game, text, user}) => {
    const [showMore, setShowMore] = useState(false);
    const [rating, setRating] = useState(0);

    useEffect(() => {
        // TODO: This logic does not work for any length of text
        const textElement = document.querySelector(`[data-review="${id}"]`);
        const numChars = text.length;
        if (numChars >= 500 && !textElement.classList.contains("line-clamp-none")) {
            setShowMore(true);
        }

        async function getUserRating(userId) {
            const response = await fetch(`http://localhost:5000/api/collection/${userId}/game/${game.id}`);
            if (response.ok) {
                const { rating } = await response.json();
                setRating(rating);
            }
        }

        getUserRating(user.id);
    }, [id, text.length, game.id, user.id]);

    function handleShowMore() {
        const textElement = document.querySelector(`[data-review="${id}"]`);
        textElement.classList.add("line-clamp-none");
        setShowMore(false);
    }

    return (
        <div className="w-full md:w-3/4">
            <hr />
            <div className="flex mt-4 mb-4">
                <a href={`/game/${game.id}`} className="max-h-52 flex-shrink-0">
                    <img className="w-full h-full object-contain rounded-md" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.png`} alt={`${game.name} Cover`} />
                </a>
                <div className="flex-grow">
                    <a href={`/profile/${user.id}`} className="flex items-center gap-2">
                        <div className="rounded-full w-8 h-8 border-black border-2 overflow-hidden">
                            <img src={ProfilePic} alt="Profile Picture" />
                        </div>
                        <span>{user.username}</span>
                    </a>
                    <div className="flex items-center gap-2 mt-2">
                        <span>{game.name}</span>
                        <Rating value={rating} precision={0.5} readOnly />
                        <span>{game.release_dates[0].y}</span>
                    </div>
                    <p data-review={id} className="mt-4 max-w-full line-clamp-5">{text}</p>
                    {showMore ? <span className="font-bold cursor-pointer" onClick={handleShowMore}>more</span> : null}
                </div>
            {/* Likes will go here */}
            </div>
            <hr />
      </div>
    )
}

export default ReviewCard;