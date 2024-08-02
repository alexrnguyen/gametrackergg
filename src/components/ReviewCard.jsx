import { Rating } from "@mui/material";
import ProfilePic from "../assets/test-profile-pic.jpg"
import { useEffect, useState } from "react";

const ReviewCard = ({id, game, text, user}) => {
    const [showMore, setShowMore] = useState(false);
    const [rating, setRating] = useState(0);
    const CHAR_LIMIT = 500;

    useEffect(() => {
        // TODO: This logic does not work for any length of text
        const numChars = text.length;
        if (numChars >= CHAR_LIMIT) {
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

    function limitChars(str, limit) {
        return str.length > limit ? `${str.slice(0, CHAR_LIMIT)}...` : str;
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
                    <p data-review={id} className="mt-4 max-w-full">{showMore ? limitChars(text, 500) : text}</p>
                    {showMore ? <span className="font-bold cursor-pointer" onClick={() => setShowMore(false)}>more</span> : null}
                </div>
            {/* Likes will go here */}
            </div>
            <hr />
      </div>
    )
}

export default ReviewCard;