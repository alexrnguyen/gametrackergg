import SearchResultCard from "./SearchResultCard";

// Displays games matching search input in modal triggered by AddGameCard
const SearchResults = ({ results, onClick }) => {

    return (
        <ul className="flex flex-col gap-6 max-h-96 overflow-y-scroll mt-4">
            {results && results.map(game => (
                <li className="result-card cursor-pointer" key={game.id} onClick={() => onClick(game.id)}>
                    <SearchResultCard game={game} />
                </li>
            ))}
        </ul>
    );
}

export default SearchResults;