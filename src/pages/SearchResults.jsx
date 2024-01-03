import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import GameCard from "../components/GameCard";
import { CircularProgress } from "@mui/material";
import getImageId from "../utils/get-image-id";


const ResultsContent = (props) => {
    const {results} = props;

    return (
        <>
            <h1>Search Results</h1>
            <ul className="games">
                {results.length === 0 && "No Games"}
                {results.map(game => {
                    return (
                        <GameCard key={game.id} gameId={game.id} imageId={game.imageId} title={game.name}/>
                    )
                })}
            </ul>
        </>
    )
}

const SearchResults = () => {
    const [results, setResults] = useState([])
    const [searchParams] = useSearchParams();
    const [input, setInput] = useState(searchParams.get("input"))
    const [dataRetrieved, setDataRetrieved] = useState(false);

    useEffect(() => {
        setInput(searchParams.get("input"))
        const fetchData = async () => {
            const data = await getData(input)
            console.log(data);
            setResults(data)
        }
        fetchData();
    }, [input])

    async function getData(input = "") {
        const response = await fetch(`http://localhost:5000/search-results/${input}`)
        const data = await response.json();
        console.log(data)
        const dataWithImages = await Promise.all(data.map(async (game) => {
            console.log(game.id);
            const imageId = await getImageId(game.id);
            game = {...game, imageId}
            return game;
        }))
        console.log(dataWithImages)
        setDataRetrieved(true);
        return dataWithImages;
    }

    return (
        <>
            {dataRetrieved ? (
                <ResultsContent results={results}/>
            ) : <CircularProgress/>}
        </>
    )
}

export default SearchResults;