import { ToggleButton, ToggleButtonGroup, CircularProgress, Button } from "@mui/material";
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import GameCard from "../components/GameCard";
import ProfilePic from "../assets/test-profile-pic.jpg"
import CategoryContainer from "../components/CategoryContainer";
import AddGameCard from "../components/AddGameCard";
import { TiDelete } from "react-icons/ti";
import SortSelector from "../components/SortSelector";
import Cookies from "js-cookie";
import ReviewsList from "../components/ReviewsList";
import { useParams } from "react-router-dom";

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
          <ToggleButton value="reviews" className="bg-opacity-0" size="small">
            Reviews
          </ToggleButton>
    </ToggleButtonGroup>
  )
}

const ShowcaseContent = () => {
  const { uid } = useParams();
  const currentUserId = Cookies.get("userId");
  const [favouriteGames, setFavouriteGames] = useState([]);

  useEffect(() => {
    async function getFavouriteGames() {
      const response = await fetch(`http://localhost:5000/api/users/${uid}/favourites`);

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
  }, [uid]);
  
  async function removeFavouriteGame(gameId) {
    const response = await fetch(`http://localhost:5000/api/users/${uid}/favourites/${gameId}`, {
      method: "DELETE",
      credentials: 'include'
    });

    if (response.status === 204) {
      window.location.reload();
    } else {
      // TODO: Handle case where game could not be removed
      // ...
    }
  }

  return (
    <div className="flex gap-8">
      <div id="favourite-games" className="">
        <h2 className="text-xl">Favourite Games</h2>
        <ul className='flex gap-4'>
          {favouriteGames.map(game => {
              return (
                <div className="relative" key={game.id}>
                  <GameCard gameId={game.id} imageId={game.cover ? game.cover.image_id : null} title={game.name}/>
                  {uid === currentUserId && 
                    <div className="cursor-pointer absolute top-0 right-0">
                      <TiDelete style={{width: "30", height: "30", color: "red", backgroundColor: "black", borderRadius: "100%"}} onClick={() => removeFavouriteGame(game.id)} />
                    </div>
                  }
                </div>
              )
          })}
          {favouriteGames.length < 4 && uid === currentUserId ? <AddGameCard /> : null}
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
  const { uid } = useParams();
  const [category, setCategory] = useState("played");
  const [gamesToDisplay, setGamesToDisplay] = useState([]);
  const [sortCriterion, setSortCriterion] = useState("date");

  useEffect(() => {
    async function getGames(userId, category) {
      const response = await fetch(`http://localhost:5000/api/collection/${userId}?status=${category}&sortBy=${sortCriterion}`);
      if (response.ok) {
        const games = await response.json();
        setGamesToDisplay(games);
      }
    }

    getGames(uid, category);
  }, [uid, category, sortCriterion]);

  function handleCriterionChange(event) {
    setSortCriterion(event.target.value);
  }

  return (
    <>
      <div>
        <div className="flex flex-col justify-center">
          <div className="flex justify-between">
            <CategoryContainer category={category} setCategory={setCategory}/>
            <SortSelector defaultValue={sortCriterion} onChange={handleCriterionChange}/>
          </div>
          {gamesToDisplay.length === 0 && "No Games"}
          <ul className="grid grid-cols-4 lg:grid-cols-8 place-items-center gap-4 py-2">
            {gamesToDisplay.map(game => {
              return (
                 <GameCard key={game.gameId} gameId={game.gameId} imageId={game.cover} title={game.name}/>
              )
            })}
          </ul>
        </div>
      </div>
    </>
  )

}

const ReviewsContent = () => {
  const { uid } = useParams();
  const [reviews, setReviews] = useState([]);
  const [sortCriterion, setSortCriterion] = useState("date");

  useEffect(() => {
    async function getUserReviews(userId) {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/reviews?sortBy=${sortCriterion}`);

      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    }

    getUserReviews(uid);
  }, [uid, sortCriterion]);

  function handleCriterionChange(event) {
    setSortCriterion(event.target.value);
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Reviews</h2>
        <SortSelector defaultValue={sortCriterion} onChange={handleCriterionChange} />
      </div>
      <ReviewsList key={reviews} reviewsList={reviews} />
    </>
  )

}

const Profile = () => {
  const { uid } = useParams();
  const currentUserId = Cookies.get("userId");
  const [section, setSection] = useState("showcase");
  const [user, setUser] = useState({});
  const [dataRetrieved, setDataRetrieved] = useState(false);
  const [followsUser, setFollowsUser] = useState(false);

  useEffect(() => {
    async function getUser() {
      const response = await fetch(`http://localhost:5000/api/users/${uid}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setDataRetrieved(true);
      }
    }

    async function followsUser() {
      const response = await fetch(`http://localhost:5000/api/users/${currentUserId}/follows/${uid}`);
      if (response.ok) {
        setFollowsUser(true);
      }
    }

    getUser();
    followsUser();
  }, [uid, currentUserId]);

  async function handleFollow() {
    const response = await fetch(`http://localhost:5000/api/users/${currentUserId}/follow/${uid}`, {
      method: "POST",
      credentials: "include",
      headers: {
          "Content-Type": "application/json"
      }
    });
    if (response.ok) {
      setFollowsUser(true);
    }
  }

  async function handleUnfollow() {
    // TODO: Implement unfollow functionality
    const response = await fetch(`http://localhost:5000/api/users/${currentUserId}/follow/${uid}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
          "Content-Type": "application/json"
      }
    });
    if (response.status === 204) {
      setFollowsUser(false);
    }
  }

  function renderFollowButton() {
    if (uid !== currentUserId && followsUser) {
      return <Button variant="contained" color="error" className="w-3/4" onClick={handleUnfollow}>Unfollow</Button>
    } else if (uid !== currentUserId) {
      return <Button variant="contained" className="w-3/4" onClick={handleFollow}>Follow</Button>
    }
  }

  return (
    <>
    {dataRetrieved ? 
        <div className="p-4">
          <header id="profile-header" className="mb-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-full w-24 h-24 border-black border-2 overflow-hidden">
                    <img src={ProfilePic} alt="Profile Picture" />
                  </div>
                  <span className="text-2xl" id="profile-username">{user.username}</span>
                </div>
                {renderFollowButton()}
              </div>
              <StatsContainer/>
              <div className="flex gap-4">
                <a className="flex flex-col items-center" href={`/following/${uid}`}>
                  <h4>Following</h4>
                  <span id="following" className="font-bold">{user.following.length}</span>
                </a>
                <a className="flex flex-col items-center" href={`/followers/${uid}`}>
                  <h4>Followers</h4>
                  <span id="followers" className="font-bold">{user.followers.length}</span>
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <ProfileNavbar section={section} setSection={setSection}/>
            </div>
          </header>
          {section === "showcase" ? <ShowcaseContent /> : (section === "games" ? <GamesContent /> : <ReviewsContent user={user} />)}
        </div>
    : <div className="h-screen flex items-center justify-center"><CircularProgress/></div>}
    </>
  );
};

export default Profile;