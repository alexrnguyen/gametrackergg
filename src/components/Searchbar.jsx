import { createElement, useState } from "react";
import GameCard from './GameCard'

var config = new Headers()

// TODO: Config settings need to be private (particularly the api key)
config.append("Client-ID", "a6jf2zoshruhutnu1tktwuoo0diy5y")
config.append("Authorization", "Bearer tdzk6592su41ij94inxjphpgbehr8w")
config.append("Content-Type", "application/json")
const url = "http://localhost:5000/";

const Searchbar = () => {
  const [searchInput, setSearchInput] = useState("");
  let data = {};

  const searchGames = e => {
    if (e.key === 'Enter')
    postData(url, searchInput).then(data => {
      console.log(data);
      
      if (searchInput.length > 0) {
        
        let results = data.filter(game => {
          return game.name.match(searchInput);
        });
        console.log(results);
        createElement(GameCard);

      }
    });
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

async function postData(url = "", searchInput = "") {
  fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({
      parcel: searchInput
    })
  })


  const response = await fetch(url)
  const data = await response.json();
  return data;
}

export default Searchbar;