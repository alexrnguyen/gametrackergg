import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import GameCard from "../components/GameCard";
import { CircularProgress } from "@mui/material";
import Pagination from '@mui/material/Pagination';

const SearchResults = () => {
    const [results, setResults] = useState([]);
    const [numResults, setNumResults] = useState(0);
    const [searchParams] = useSearchParams();
    const input = useRef(searchParams.get("input"))
    const [dataRetrieved, setDataRetrieved] = useState(false);
    const numPages = useRef(1);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getData(input.current, page);
            console.log(data);
            setResults(data);
        }
        fetchData();
    }, [input, page])

    async function getData(input = "", page) {
        const response = await fetch(`http://localhost:5000/api/games?searchInput=${input}&page=${page}`);
        const data = await response.json();
        const games = data.games;
        numPages.current = data.numPages;
        setNumResults(data.count);
        setDataRetrieved(true);
        return games;
    }

    function handlePageChange(event, value) {
        console.log("Page changed!", value);
        setPage(value);
    }

    return (
        <>
            {dataRetrieved ? (
                <>
                    <h1 className="pl-8">{results.length > 0 ? `Found ${numResults} results matching "${input.current}"` : `No games found matching "${input}"`} </h1>
                    <ul className="grid grid-cols-auto-fill-200 place-items-center gap-4 py-2">
                        {results.map(game => {
                            return (
                                <GameCard key={game.id} gameId={game.id} imageId={game.cover ? game.cover.image_id : null} title={game.name}/>
                            )
                        })}
                    </ul>
                    <div className="flex justify-center py-2">
                        <Pagination count={numPages.current} page={page} onChange={handlePageChange} />
                    </div>
                </>
            ) : <div className="h-screen flex items-center justify-center"><CircularProgress/></div>}
        </>
    )
}

export default SearchResults;