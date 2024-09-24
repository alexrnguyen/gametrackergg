import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      <input
        className="bg-grey w-full text-white p-1 flex-grow rounded-sm"
        type="text"
        placeholder="Search a game"
        onChange={handleChange}
        onKeyDown={searchGames}
        value={searchInput}
      />
  );
};

export default Searchbar;