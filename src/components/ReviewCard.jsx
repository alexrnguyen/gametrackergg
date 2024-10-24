import { Rating } from "@mui/material";
import ProfilePic from "../assets/test-profile-pic.jpg"
import { useEffect, useRef, useState } from "react";
import Button from '@mui/material/Button';
import StyledMenu from "./StyledMenu";
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Cookies from "js-cookie";
import { PushPin } from "@mui/icons-material";

// TODO: handleEdit and handleDelete aren't used here, but are required since OptionsMenu needs them (FIX PROP DRILLING)
const ReviewCard = ({id, game, text, user, handleEdit, handleDelete}) => {
    const currentUserId = Cookies.get("userId");
    const [showMore, setShowMore] = useState(false);
    const [rating, setRating] = useState(0);
    const pinnedRef = useRef();
    const CHAR_LIMIT = 500;

    useEffect(() => {
        const numChars = text.length;
        if (numChars >= CHAR_LIMIT) {
            setShowMore(true);
        }

        async function getUserRating() {
            const response = await fetch(`http://localhost:5000/api/collection/${user._id}/game/${game.id}`);
            if (response.ok) {
                const { rating } = await response.json();
                setRating(rating);
            }
        }

        async function checkIfPinned() {
            const response = await fetch(`http://localhost:5000/api/users/${user._id}/reviews/pinned`);
            if (response.ok) {
                const data = await response.json();
                if (data.filter(review => review._id === id)) {
                    pinnedRef.current = true;
                } else {
                    pinnedRef.current = false;
                }
            }
        }

        getUserRating();
        if (user._id === currentUserId) {
            checkIfPinned();
        }
    }, [id, text.length, game.id, user._id, currentUserId]);

    function limitChars(str, limit) {
        return str.length > limit ? `${str.slice(0, CHAR_LIMIT)}...` : str;
    }

    return (
        <div className="w-full">
            <hr />
            <div className="flex mt-4 mb-4">
                <a href={`/game/${game.id}`} className="max-h-52 flex-shrink-0">
                    <img className="w-full h-full object-contain rounded-md" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.png`} alt={`${game.name} Cover`} />
                </a>
                <div className="flex-grow">
                    <div className="flex justify-between">
                        <a href={`/profile/${user._id}`} className="flex items-center gap-2">
                            <div className="rounded-full w-8 h-8 border-black border-2 overflow-hidden">
                                <img src={ProfilePic} alt="Profile Picture" />
                            </div>
                            <span>{user.username}</span>
                        </a>
                        {currentUserId === user._id && 
                            <OptionsMenu 
                                reviewId={id}
                                pinned={pinnedRef.current}
                                handleEdit={handleEdit} 
                                handleDelete={handleDelete}/>
                        }
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <span>{game.name} ({game.release_dates[0].y})</span>
                        <Rating value={rating} precision={0.5} readOnly />
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
  
const OptionsMenu = ({reviewId, pinned, handleEdit, handleDelete}) => {
    const currentUserId = Cookies.get("userId");
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);


    async function handlePin(id) {
        const response = await fetch(`http://localhost:5000/api/users/${currentUserId}/reviews/pin/${id}`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        });

        // TODO: Show alert when review is successfully pinned 
    }

    async function handleUnpin(id) {
        const response = await fetch(`http://localhost:5000/api/users/${currentUserId}/reviews/pin/${id}`, {
            method: "DELETE",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        // TODO: Show alert when review is successfully pinned 
    }
    
    function handleClick(event) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    return (
        <div>
        <Button
            id="demo-customized-button"
            aria-controls={open ? 'demo-customized-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            variant="contained"
            disableElevation
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
        >
            Options
        </Button>
        <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
            'aria-labelledby': 'demo-customized-button',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
        >
            <MenuItem onClick={handleEdit} disableRipple>
            <EditIcon />
                Edit
            </MenuItem>
            <MenuItem onClick={pinned ? () => handlePin(reviewId) : () => handleUnpin(reviewId)} disableRipple>
            <PushPin />
                {pinned ? "Pin" : "Unpin"}
            </MenuItem>
            <MenuItem onClick={handleDelete} disableRipple>
            <DeleteIcon />
                Delete
            </MenuItem>
        </StyledMenu>
        </div>
    );
}

export default ReviewCard;