
// Card containing game details shown in search results page
const SearchResultCard = ({ game }) => {
    return (
        <div className="flex gap-4 hover:border-solid hover:border-black">
            <img className="max-h-20 object-contain rounded-md" src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover ? game.cover.image_id : null}.png`} alt={`${game.name} Cover`} />
            <div>
                <h2>{game.name} <span>({game.release_dates ? game.release_dates[0].y : "N/A"})</span></h2>
                <ul className="flex flex-wrap gap-2">
                    {game.platforms && game.platforms.map(platform => {
                        return <li key={platform.name} className="bg-black text-white text-sm border-solid rounded-md p-2">{platform.name}</li>
                    })}
                </ul>
            </div>
        </div>
    )
}

export default SearchResultCard;