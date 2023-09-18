import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import GameCard from "../components/GameCard";
import getImageId from "../utils/get-image-id";

const SearchResults = () => {
    const [results, setResults] = useState([])
    const [searchParams] = useSearchParams();
    const [input, setInput] = useState(searchParams.get("input"))

    useEffect(() => {
        setInput(searchParams.get("input"))
        const fetchData = async () => {
            const data = await postData(input)
            console.log(data);
            setResults(data)
        }
        fetchData();
    }, [input])

    async function postData(input = "") {
        fetch("http://localhost:5000/", {
          method: 'POST',
          headers: {
            "Content-Type": 'application/json'
          },
          body: JSON.stringify({
            parcel: input
          })
        })
      
        const response = await fetch("http://localhost:5000/")
        const data = await response.json();
        console.log(data)
        const dataWithImages = await Promise.all(data.map(async (game) => {
            console.log(game.id);
            const imageId = await getImageId(game.id);
            console.log(imageId)
            game = {...game, imageId}
            return game;
        }))
        console.log(dataWithImages)
        return dataWithImages;
    }

    return (
        <>
            <h1>Search Results</h1>
            <ul className="games">
                {results.length === 0 && "No Games"}
                {results.map(game => {
                    return (
                        <GameCard key={game.id} imageId={game.imageId} title={game.name}/>
                    )
                })}
            </ul>
        </>
    )
}

export default SearchResults;