import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import GameCard from "../components/GameCard";
import { CircularProgress } from "@mui/material";


const ResultsContent = (props) => {
    const {results, input} = props;

    // TODO: Show all games matching input (currently limited to 10 to avoid going over request limit)
    return (
        <>
            <h1 className="pl-2">{results.length > 0 ? `Found ${results.length} results matching "${input}"` : `No games found matching "${input}"`} </h1>
            <ul className="grid grid-cols-auto-fill-200 place-items-center gap-4 py-2">
                {results.map(game => {
                    return (
                        <GameCard key={game.id} gameId={game.id} imageId={game.cover.image_id} title={game.name}/>
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
        setDataRetrieved(true);
        return data;
    }

    return (
        <>
            {dataRetrieved ? (
                <ResultsContent results={results} input={input}/>
            ) : <div className="h-screen flex items-center justify-center"><CircularProgress/></div>}
        </>
    )
}

export default SearchResults;