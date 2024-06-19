import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from "react";
import GameCard from "../components/GameCard";
import ProfilePic from "../assets/test-profile-pic.jpg"
import CategoryContainer from "../components/CategoryContainer";

const StatsContainer = () => {
  // TODO: Implement container showing number of games in each category on the top of the Profile page
}

const ProfileNavbar = ({section, setSection}) => {
  ProfileNavbar.propTypes = {
    section: PropTypes.string.isRequired,
    setSection: PropTypes.func.isRequired
  }

  function handleChange(e, newSection) {
    if (newSection !== null) {
      setSection(newSection);
    }
  }

  return (
    <ToggleButtonGroup 
        className="" 
        value={section}
        defaultValue='showcase'
        exclusive 
        onChange={handleChange}
        >
          <ToggleButton value="showcase" className="bg-opacity-0" size="small">
            Showcase
          </ToggleButton>
          <ToggleButton value="games" className="bg-opacity-0" size="small">
            Games
          </ToggleButton>
    </ToggleButtonGroup>
  )
}

const ShowcaseContent = () => {

  // Temporary
  const favouriteGames = useRef([
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
      gameId: 7331,
      imageId: "co1r7h",
      title: "Uncharted 4: A Thief's End"
    }
  ]);

  return (
    <div className="flex gap-8">
      <div id="favourite-games" className="">
        <h2 className="text-xl">Favourite Games</h2>
        <ul className='flex gap-4'>
          {favouriteGames.current.map(game => {
              return (
                  <GameCard key={game.gameId} gameId={game.gameId} imageId={game.imageId} title={game.title}/>
              )
          })}
        </ul>
      </div>
      <div id="reviews">
        <h2 className="text-xl">Pinned Reviews</h2>
          {/* Display most recent reviews*/}
          <ul className="flex flex-col gap-8">
          </ul>
      </div>
    </div>
  )
}

const GamesContent = () => {
  const userId = localStorage.getItem("userId");
  const [category, setCategory] = useState("played");
  const [gamesToDisplay, setGamesToDisplay] = useState([]);

  useEffect(() => {
    async function GetGames(userId, category) {
      const response = await fetch(`http://localhost:5000/api/collection/${userId}?status=${category}`);
      if (response.ok) {
        const games = await response.json();
        setGamesToDisplay(games);
        console.log(gamesToDisplay);
      }
    }

    GetGames(userId, category);
  }, [userId, category]);

  return (
    <>
      <div>
        <div className="flex flex-col justify-center">
          <CategoryContainer category={category} setCategory={setCategory}/>
          {gamesToDisplay.length === 0 && "No Games"}
          <ul className="grid grid-cols-auto-fill-200 place-items-center gap-4 py-2">
            {gamesToDisplay.map(game => {
              return (
                <>
                  <GameCard key={game.gameId} gameId={game.gameId} imageId={game.cover} title={game.name}/>
                </>
              )
            })}
          </ul>
        </div>
      </div>
    </>
  )

}

const Profile = () => {
  const [section, setSection] = useState("showcase");

  return (
    <div className="p-4">
      <header id="profile-header" className="mb-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="rounded-full w-24 h-24 border-black border-2 overflow-hidden">
              <img src={ProfilePic} alt="Profile Picture" />
            </div>
            <span className="text-2xl" id="profile-username">PieceOfPi</span>
          </div>
          <StatsContainer/>
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <h4>Following</h4>
              <span id="following" className="font-bold">13</span>
            </div>
            <div className="flex flex-col items-center">
              <h4>Followers</h4>
              <span id="followers" className="font-bold">13</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <ProfileNavbar section={section} setSection={setSection}/>
        </div>
      </header>
      {section === "showcase" ? <ShowcaseContent /> : <GamesContent />}
    </div>
  );
};

export default Profile;