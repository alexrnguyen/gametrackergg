import { ToggleButton, ToggleButtonGroup, CircularProgress } from "@mui/material";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import ProfilePic from "../assets/test-profile-pic.jpg"
import CategoryContainer from "../components/CategoryContainer";
import AddGameCard from "../components/AddGameCard";

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
  const userId = localStorage.getItem("userId");
  const [favouriteGames, setFavouriteGames] = useState([]);

  useEffect(() => {
    async function getFavouriteGames() {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/favourites`);

      if (response.ok) {
        const favouriteGameIds = await response.json();
        const promises = [];
        Array.from(favouriteGameIds).forEach(id => {
          const promise = fetch(`http://localhost:5000/api/games/${id}`);
          promises.push(promise);
        });
        const games = await Promise.all(promises).then(async (res) => {
          return Promise.all(
            // Data contains an array with a single object. Add the object to favourite games
            res.map(async (data) => (await data.json())[0])
          )
        });
        setFavouriteGames(games);
      }
    }

    getFavouriteGames();
  }, [userId]);

  return (
    <div className="flex gap-8">
      <div id="favourite-games" className="">
        <h2 className="text-xl">Favourite Games</h2>
        <ul className='flex gap-4'>
          {favouriteGames.map(game => {
              return (
                  <GameCard key={game.id} gameId={game.id} imageId={game.cover.image_id} title={game.name}/>
              )
          })}
          {favouriteGames.length < 4 ? <AddGameCard /> : null}
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
    async function getGames(userId, category) {
      const response = await fetch(`http://localhost:5000/api/collection/${userId}?status=${category}`);
      if (response.ok) {
        const games = await response.json();
        setGamesToDisplay(games);
        console.log(gamesToDisplay);
      }
    }

    getGames(userId, category);
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
  const userId = localStorage.getItem("userId");
  const [section, setSection] = useState("showcase");
  const [user, setUser] = useState({});
  const [dataRetrieved, setDataRetrieved] = useState(false);

  useEffect(() => {
    async function getUser(userId) {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`);
      console.log(response.status);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setDataRetrieved(true);
      }
    }

    getUser(userId);
  }, [userId]);

  return (
    <>
    {dataRetrieved ? 
        <div className="p-4">
          <header id="profile-header" className="mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="rounded-full w-24 h-24 border-black border-2 overflow-hidden">
                  <img src={ProfilePic} alt="Profile Picture" />
                </div>
                <span className="text-2xl" id="profile-username">{user.username}</span>
              </div>
              <StatsContainer/>
              <div className="flex gap-4">
                <a className="flex flex-col items-center" href={`/following/${userId}`}>
                  <h4>Following</h4>
                  <span id="following" className="font-bold">{user.following.length}</span>
                </a>
                <a className="flex flex-col items-center" href={`/followers/${userId}`}>
                  <h4>Followers</h4>
                  <span id="followers" className="font-bold">{user.followers.length}</span>
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <ProfileNavbar section={section} setSection={setSection}/>
            </div>
          </header>
          {section === "showcase" ? <ShowcaseContent /> : <GamesContent />}
        </div>
    : <div className="h-screen flex items-center justify-center"><CircularProgress/></div>}
    </>
  );
};

export default Profile;