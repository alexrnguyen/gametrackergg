import { Button } from '@mui/material';
import GameCard from "../components/GameCard";
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Feature = ({name, description}) => {

    return (
        <div className='text-center bg-black text-white rounded-lg p-4 md:w-1/3 md:h-48'>
            <h3 className='text-2xl mb-4'>{name}</h3>
            <p>{description}</p>
        </div>
    )
};

const Home = () => {
    const navigate = useNavigate();

    const features = [
        {
            name: "Track",
            description: "Keep track of games you are currently playing, games you have completed, and games in your backlog."
        },
        {
            name: "Discover",
            description: "Find the next game to play whether it is a new release or a hidden gem you missed out on."
        },
        {
            name: "Socialize",
            description: "Share your experiences and interact with gamers around the world."
        }
    ];

    // Temporarily hard coded
    const hottestGames = useRef([
        {
          gameId: 9927,
          imageId: "co1r76",
          title: "Persona 5",
        }, 
        {
          gameId: 1942,
          imageId: "co1wyy",
          title: "The Witcher 3: Wild Hunt",
        },
        {
          gameId: 1009,
          imageId: "co1r7f",
          title: "The Last of Us",
        },
        {
          gameId: 217590,
          imageId: "co7lbb",
          title: "Tekken 8", 
        },
        {
          gameId: 252647,
          imageId: "co6z12",
          title: "Persona 3 Reload"
        }
    ]);

    return (
        <div className="flex flex-col items-center px-4 md:px-0 py-4 gap-8">
            <div id="hero" className="relative flex flex-col md:flex-row justify-center items-center w-full md:w-3/4">
                <div id='site-info-container' className='flex flex-col gap-8 w-1/2'>
                    <h2 className='text-4xl text-center md:text-left font-bold text-white md:text-black'>Level up your gaming experience</h2>
                    <p className='text-center md:text-left text-white md:text-black'>Join <span className='font-bold'>GameTracker.gg</span> today to share your gaming experiences and find the perfect game to play next!</p>
                    <Button variant="contained" color="info" className='sm:w-full md:w-1/2 lg:w-1/3' onClick={() => navigate("/sign-up")}>Sign Up</Button>
                </div>
                <img className="absolute md:static md:w-1/2 rounded-md opacity-80 md:opacity-100 -z-10" src="https://images.igdb.com/igdb/image/upload/t_original/scixvx.jpg" alt="Tekken 8" />
            </div>
            <div id="hottest-games-section" className='flex flex-col gap-8'>
                <h2 className='font-bold text-xl'>Hottest Games</h2>
                {/* Refactor into image carousel */}
                <ul className='flex gap-4'>
                    {hottestGames.current.map(game => {
                        return (
                            <GameCard key={game.gameId} gameId={game.gameId} imageId={game.imageId} title={game.title}/>
                        )
                    })}
                </ul>
            </div>
            <div id="features-showcase" className="flex-col md:flex-row flex justify-around items-center gap-8 w-3/4">
                {features.map(feature => {
                    return (<Feature key={feature.name} name={feature.name} description={feature.description}/>)
                })}
            </div>
        </div>
    )
};

export default Home;