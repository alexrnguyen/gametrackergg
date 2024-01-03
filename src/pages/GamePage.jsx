import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import getImageId from "../utils/get-image-id";
import { CircularProgress } from "@mui/material";

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

    useEffect(() => {
        const fetchData = async () => {
            const queriedData = await getGameData();
            console.log(queriedData);
            setGameData(queriedData);
        }
        fetchData();
    }, [id]);


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

    return (
        <>
            {dataRetrieved ? (
                <>
                    <h1>{gameData[0].name}</h1>
                    <img className="card-game-image" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${gameData.imageId}.png`} alt="" />
                    <p>{gameData[0].summary}</p>
                </>
            ) : <CircularProgress/>}
        </>
    )
}

export default GamePage;