import { createElement, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress"

const Searchbar = () => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const searchGames = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search-results?input=${searchInput}`);
      window.location.reload();
    }
  }
  
  const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };
  return (
    <div>
      <input
        className="searchbar"
        type="text"
        placeholder="Search a game"
        onChange={handleChange}
        onKeyDown={searchGames}
        value={searchInput}
      />
    </div>
  );
};

export default Searchbar;