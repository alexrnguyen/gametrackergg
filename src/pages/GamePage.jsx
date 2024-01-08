import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from 'prop-types';
import getImageId from "../utils/get-image-id";
import { ButtonGroup, IconButton, CircularProgress, Card, Rating, Alert } from "@mui/material";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import QueueIcon from '@mui/icons-material/Queue';
import CakeIcon from '@mui/icons-material/Cake';


const StatusContainer = (props) => {
    StatusContainer.propTypes = {
        playedStatus: PropTypes.bool.isRequired,
        backlogStatus: PropTypes.bool.isRequired,
        wishlistStatus: PropTypes.bool.isRequired,
        setPlayedStatus: PropTypes.func.isRequired,
        setBacklogStatus: PropTypes.func.isRequired,
        setWishlistStatus: PropTypes.func.isRequired,
        setShowAlert: PropTypes.func.isRequired,
        setAlertContent: PropTypes.func.isRequired
    }
    const {playedStatus, backlogStatus, wishlistStatus, setPlayedStatus, setBacklogStatus, setWishlistStatus, setShowAlert, setAlertContent} = props;

    const [rating, setRating] = useState(4);
    function togglePlayedStatus() {
        setPlayedStatus(!playedStatus);
        setShowAlert(true);
        if (!playedStatus) {
            setAlertContent("Game added to played games");
        } else {
            setAlertContent("Game removed from played games");
        }   
    }

    function toggleBacklogStatus() {
        setBacklogStatus(!backlogStatus);
        setShowAlert(true);
        if (!backlogStatus) {
            setAlertContent("Game added to backlog");
        } else {
            setAlertContent("Game removed from backlog");
        }
    }

    function toggleWishlistStatus() {
        setWishlistStatus(!wishlistStatus);
        setShowAlert(true);
        if (!wishlistStatus) {
            setAlertContent("Game added to wishlist");
        } else {
            setAlertContent("Game removed from wishlist");
        }
    }

    return (
        <Card variant="outlined" className="w-96">
            <div className="flex flex-col items-center">
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
            </div>   
        </Card>
    )
}

const GamePage = () => {
    const [gameData, setGameData] = useState({
        0: {
            name: null,
            summary: null, 
        },
        imageId: null,
        year: null
    });
    const [dataRetrieved, setDataRetrieved] = useState(false);
    const {id} = useParams();

    const [showAlert, setShowAlert] = useState(false);
    const [alertContent, setAlertContent] = useState("");

    const [playedStatus, setPlayedStatus] = useState(false);
    const [backlogStatus, setBacklogStatus] = useState(false);
    const [wishlistStatus, setWishlistStatus] = useState(false);

    useEffect(() => {
        async function getGameData() {
            const gameResponse = await fetch(`http://localhost:5000/game/${id}`);
            if (gameResponse.status === 200) {
                let data = await gameResponse.json();
                console.log(data);
                const yearResponse = await fetch(`http://localhost:5000/year/${data[0].release_dates[0]}`)
                const releaseData = await yearResponse.json();
                const year = releaseData.y;
                console.log(year);
                const imageId = await getImageId(id);
                data = {...data, imageId, year};
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

    useEffect(() => {
        if (showAlert) {
            // Display alert for 2 seconds
            const timeout = setTimeout(() => setShowAlert(false), 2000);
            return () => clearTimeout(timeout);
        }
    }, [showAlert]);

    return (
        <>
            {dataRetrieved ? (
                <div className="game-page-container">
                    <img className="place-self-center" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${gameData.imageId}.png`} alt="" />
                    <div id="info-container" className="flex flex-col gap-4">
                        <h1 className="font-bold text-3xl">{gameData[0].name} <span className="text-base">({gameData.year})</span></h1>
                        <StatusContainer 
                            playedStatus={playedStatus} 
                            backlogStatus={backlogStatus} 
                            wishlistStatus={wishlistStatus}
                            setPlayedStatus={setPlayedStatus}
                            setBacklogStatus={setBacklogStatus}
                            setWishlistStatus={setWishlistStatus}
                            setShowAlert={setShowAlert}
                            setAlertContent={setAlertContent}
                        />
                        <p>{gameData[0].summary}</p>
                    </div>
                    {showAlert ? <Alert severity="success" className="absolute bottom-5 left-5">{alertContent}</Alert> : null}
                </div>
            ) : <div className="h-screen flex items-center justify-center"><CircularProgress/></div>}
        </>
    )
}

export default GamePage;