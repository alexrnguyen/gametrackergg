import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ButtonGroup, IconButton, CircularProgress, Card, Rating, Alert, Button } from "@mui/material";
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import QueueIcon from '@mui/icons-material/Queue';
import CakeIcon from '@mui/icons-material/Cake';
import { PlayArrow } from "@mui/icons-material";
import ScreenshotCarousel from "../components/ScreenshotCarousel";
import RatingDistribution from "../components/RatingDistribution";
import ReviewModal from "../components/ReviewModal";
import Cookies from "js-cookie";
import ReviewsList from "../components/ReviewsList";


const StatusContainer = (props) => {
    const {setShowAlert, setAlertContent} = props;

    const [playedStatus, setPlayedStatus] = useState(false);
    const [playingStatus, setPlayingStatus] = useState(false);
    const [backlogStatus, setBacklogStatus] = useState(false);
    const [wishlistStatus, setWishlistStatus] = useState(false);
    const [rating, setRating] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const {id} = useParams();
    const userId = Cookies.get("userId");

    useEffect(() => {
        async function getUserGameStatus() {
            // Get user's status and rating for the game
            if (userId === null) {
                return;
            }
            const response = await fetch(`http://localhost:5000/api/collection/${userId}/game/${id}`);
            const data = await response.json();
            const status = data.status;
            setRating(data.rating);
            if (status === null) {
                return;
            }
            for (const category of status) {
                switch(category) {
                    case "playing":
                        setPlayingStatus(true);
                        break;
                    case "played":
                        setPlayedStatus(true);
                        break;
                    case "backlog":
                        setBacklogStatus(true);
                        break;
                    case "wishlist":
                        setWishlistStatus(true);
                        break;
                }
            }
        }

        getUserGameStatus();
    }, [id, userId, rating, playingStatus, playedStatus, backlogStatus, wishlistStatus]);

    /**
     * Toggle status given by status parameter and display alert showing whether a game was
     * added or removed from a category
     * @param {boolean} status Determines whether a game belongs to a category. True if a game belongs to a category, false otherwise
     * @param {React.Dispatch<React.SetStateAction<boolean>>} setStatus Setter function for the status state variable
     * @param {string} category Category name of status
     */
    async function toggleStatus(status, setStatus, category) {
        const data = {gameId: id, status: category, rating: rating};
        let response;
        if (!status) {
            setAlertContent(`Game added to ${category}`);
            response = await fetch(`http://localhost:5000/api/collection/${userId}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
        } else {
            setAlertContent(`Game removed from ${category}`);
            response = await fetch(`http://localhost:5000/api/collection/${userId}/game/${id}/status/${category}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            });
        }

        if ([200, 201, 204].includes(response.status)) {
            setStatus(!status);
            setShowAlert(true);
        } else {
            // TODO: Add error handling (alert user that something went wrong)
            // ...
        }
    }

    async function saveRating(newRating) {
        const data = {gameId: id, rating: newRating};
        const response = await fetch(`http://localhost:5000/api/collection/${userId}/rating`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (response.status === 201 || response.status === 200) {
            setRating(newRating);
        } else {
            // TODO: Add error handling (alert user that something went wrong)
            // ...
        }
    }

    // TODO: Card width does not account for mobile devices (or any smaller screen)
    return (
        <>
            {userId ? <Card variant="outlined" className="h-fit">
                <div className="flex flex-col items-center">
                    <div className="flex justify-evenly w-full">
                        <Rating
                            name="personal-rating"
                            value={rating ? rating : 0}
                            precision={0.5}
                            size="large"
                            onChange={(_, newRating) => saveRating(newRating)}
                        />
                        <Button className="" variant="outlined" onClick={() => setShowModal(true)}>Add Review</Button>
                    </div>
                    <ButtonGroup>
                        <IconButton aria-label="played" onClick={() => toggleStatus(playedStatus, setPlayedStatus, "played")}>
                            <SportsEsportsIcon id="played-icon" color={playedStatus ? "success" : "inherit"} />
                            <p>Played</p>
                        </IconButton>
                        <IconButton aria-label="playing" onClick={() => toggleStatus(playingStatus, setPlayingStatus, "playing")}>
                            <PlayArrow id="playing-icon" color={playingStatus ? "error" : "inherit"} />
                            <p>Playing</p>
                        </IconButton>
                        <IconButton aria-label="backlog" onClick={() => toggleStatus(backlogStatus, setBacklogStatus, "backlog")}>
                            <QueueIcon id="backlog-icon" color={backlogStatus ? "info" : "inherit"}/>
                            <p>Backlog</p>
                        </IconButton>
                        <IconButton aria-label="wishlist" onClick={() => toggleStatus(wishlistStatus, setWishlistStatus, "wishlist")}>
                            <CakeIcon id="wishlist-icon" color={wishlistStatus ? "warning" : "inherit"}/>
                            <p>Wishlist</p>
                        </IconButton>
                    </ButtonGroup>
                    <ReviewModal open={showModal} onClose={() => setShowModal(false)} newReview={true} />
                </div>   
            </Card> : <Card variant="outlined" className="h-fit text-center p-4"><a href="/sign-in">Sign in to track, rate, or review</a></Card>}
        </>
    )
}

const GamePage = () => {
    const { id } = useParams();

    const [gameData, setGameData] = useState({
        0: {
            name: null,
            summary: null, 
        },
        imageId: null,
        year: null,
        screenshots: []
    });

    const averageRating = useRef('N/A');
    const ratings = useRef([]);
    const [reviews, setReviews] = useState([]); 
    const [dataRetrieved, setDataRetrieved] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertContent, setAlertContent] = useState("");

    useEffect(() => {
        async function getGameData() {
            const gameResponse = await fetch(`http://localhost:5000/api/games/${id}`);
            if (gameResponse.ok) {
                let data = await gameResponse.json();

                // Retrieve year from initial release date (first date listed)
                let year;
                if (data[0].release_dates !== undefined) {
                    year = data[0].release_dates[0].y;
                } else {
                    year = "N/A";
                }

                // Retrive names of involved companies (developer(s) and publisher(s))
                if (data[0].involved_companies) {
                    const companyIDs = data[0].involved_companies.map(companyJSON => companyJSON.company);
                    const searchParams = new URLSearchParams({ company: companyIDs });
                    const response = await fetch(`http://localhost:5000/api/companies?${searchParams}`);
                    const companiesData = await response.json();
                    
                    for (let i = 0; i < companiesData.length; i++) {
                        companiesData[i]["developer"] = data[0].involved_companies[i]["developer"];
                        companiesData[i]["publisher"] = data[0].involved_companies[i]["publisher"];
                    }
                    data = {...data, year, companies: companiesData};
                } else {
                    data = {...data, year, companies: []};
                }
                return data;
            } else {
                return null;
            }
        }

        async function getRatings() {
            const ratingsResponse = await fetch(`http://localhost:5000/api/games/${id}/ratings`);
            if (ratingsResponse.ok) {
                const data = await ratingsResponse.json();
                averageRating.current = data.averageRating;
                ratings.current = data.ratings;
            } else {
                return null;
            }
        }

        async function getReviews() {
            const reviewsResponse = await fetch(`http://localhost:5000/api/games/${id}/reviews`);
            if (reviewsResponse.ok) {
                const data = await reviewsResponse.json();
                setReviews(data);
            } else {
                return null;
            }
        }

        const fetchData = async () => {
            const queriedData = await getGameData();
            setGameData(queriedData);
            await getRatings();
            await getReviews();
            setDataRetrieved(true);
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
                <div className="grid grid-cols-[1fr_2fr] lg:grid-cols-[1fr_4fr] p-4 gap-8">
                    <img className="place-self-center" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${gameData[0].cover ? gameData[0].cover.image_id : null}.png`} alt="" />
                    <div id="info-container" className="flex flex-col gap-4">
                        <h1 className="font-bold text-3xl">{gameData[0].name} <span className="text-3xl">({gameData.year})</span></h1>
                        <div className="flex gap-4 items-center">
                            <StatusContainer 
                                setShowAlert={setShowAlert}
                                setAlertContent={setAlertContent}
                            />
                            <p className="text-xl pl-12">Average Rating: <span className="font-bold">{averageRating.current}</span></p>
                            <RatingDistribution ratings={ratings.current}/>
                        </div>
                        <p>{gameData[0].summary || "No description available"}</p>
                    </div>
                    <div className="justify-self-center flex flex-col gap-4">
                        <div>
                            <p className="font-bold underline">Genres</p>
                            {gameData[0].genres.map(genre => {
                                return <p key={genre.name}>{genre.name}</p>
                            })}
                        </div>
                        <div>
                            <p className="font-bold underline">Platforms</p>
                            {gameData[0].platforms.map(platform => {
                                return <p key={platform.name}>{platform.name}</p>
                            })}
                        </div>
                        <div>
                            <p className="font-bold underline">Developers</p>
                            {gameData.companies.filter(company => company.developer).map(developer => {
                                return <p key={developer.name}>{developer.name}</p>
                            })}
                        </div>
                        <div>
                            <p className="font-bold underline">Publishers</p>
                            {gameData.companies.filter(company => company.publisher).map(publisher => {
                                return <p key={publisher.name}>{publisher.name}</p>
                            })}
                        </div>
                    </div>
                    <div className="col-start-2">
                        {gameData[0].screenshots ? <ScreenshotCarousel screenshots={gameData[0].screenshots} /> : null}
                        <div className="">
                            <h2 className="font-bold text-xl">Reviews</h2>
                            <ReviewsList reviewsList={reviews} />
                        </div>
                    </div>
                    {showAlert ? <Alert severity="success" className="absolute bottom-5 left-5">{alertContent}</Alert> : null}
                </div>
            ) : <div className="h-screen flex items-center justify-center"><CircularProgress/></div>}
        </>
    )
}

export default GamePage;