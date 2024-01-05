import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from 'prop-types';
import getImageId from "../utils/get-image-id";
import { ButtonGroup, IconButton, CircularProgress, Card, Rating } from "@mui/material";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import QueueIcon from '@mui/icons-material/Queue';
import CakeIcon from '@mui/icons-material/Cake';


const StatusContainer = (props) => {
    StatusContainer.propTypes = {
        playedStatus: PropTypes.bool.isRequired,
        backlogStatus: PropTypes.bool.isRequired,
        wishlistStatus: PropTypes.bool.isRequired
    }
    const {playedStatus, backlogStatus, wishlistStatus} = props;

    const [playedStatusState, setPlayedStatusState] = useState(playedStatus);
    const [backlogStatusState, setBacklogStatusState] = useState(backlogStatus);
    const [wishlistStatusState, setWishlistStatusState] = useState(wishlistStatus);
    const [rating, setRating] = useState(4);
    function togglePlayedStatus() {
        setPlayedStatusState(!playedStatusState);
    }

    function toggleBacklogStatus() {
        setBacklogStatusState(!backlogStatusState);
    }

    function toggleWishlistStatus() {
        setWishlistStatusState(!wishlistStatusState);
    }

    return (
        <Card variant="outlined">
                <Rating
                    name="personal-rating"
                    value={rating}
                    precision={0.5}
                    size="large"
                    onChange={(event, newRating) => setRating(newRating)}
                />
                <ButtonGroup>
                    <IconButton aria-label="played" onClick={() => togglePlayedStatus()}>
                        <SportsEsportsIcon id="played-icon" color={playedStatus ? "success" : "inherit"} />
                        <p>Played</p>
                    </IconButton>
                    <IconButton aria-label="backlog" onClick={() => toggleBacklogStatus()}>
                        <QueueIcon id="backlog-icon" color={backlogStatus ? "info" : "inherit"}/>
                        <p>Backlog</p>
                    </IconButton>
                    <IconButton aria-label="wishlist" onClick={() => toggleWishlistStatus()}>
                        <CakeIcon id="wishlist-icon" color={wishlistStatus ? "warning" : "inherit"}/>
                        <p>Wishlist</p>
                    </IconButton>
                </ButtonGroup>
        </Card>
    )
}

const GamePage = () => {
    const [gameData, setGameData] = useState({
        0: {
            name: null,
            summary: null, 
        },
        imageId: null
    });
    const [dataRetrieved, setDataRetrieved] = useState(false);
    const {id} = useParams();

    const playedStatus = useRef(false);
    const backlogStatus = useRef(false);
    const wishlistStatus = useRef(false);

    useEffect(() => {
        async function getGameData() {
            const gameResponse = await fetch(`http://localhost:5000/game/${id}`);
            if (gameResponse.status === 200) {
                let data = await gameResponse.json();
                console.log(data);
                const imageId = await getImageId(id);
                data = {...data, imageId};
                setDataRetrieved(true);
                return data;
            } else {
                return null;
            }
        }

        const fetchData = async () => {
            const queriedData = await getGameData();
            console.log(queriedData);
            setGameData(queriedData);
        }
        fetchData();
    }, [id]);

    return (
        <>
            {dataRetrieved ? (
                <>
                    <h1>{gameData[0].name}</h1>
                    <img className="card-game-image" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${gameData.imageId}.png`} alt="" />
                    <StatusContainer 
                        playedStatus={playedStatus.current} 
                        backlogStatus={backlogStatus.current} 
                        wishlistStatus={wishlistStatus.current}
                    />
                    <p>{gameData[0].summary}</p>
                </>
            ) : <CircularProgress/>}
        </>
    )
}

export default GamePage;