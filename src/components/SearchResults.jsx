
// Displays games matching search input in modal triggered by AddGameCard
const SearchResults = ({ results, onClick }) => {
    console.log(results.length);
    return (
        <ul className="flex flex-col gap-4 max-h-96 overflow-y-scroll">
            {results.map(game => (
                <li className="result-card" key={game.id} onClick={() => onClick(game.id)}>
                    {game.name}
                </li>
            ))}
        </ul>
    );
}

export default SearchResults;