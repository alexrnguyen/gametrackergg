import './App.css'
import './styles.css'
import Home from "./pages/Home";
import MyGames from "./pages/MyGames";
import Profile from "./pages/Profile";
import Navbar from './components/Navbar'
import { Route, Routes, createSearchParams } from 'react-router-dom'
import SearchResults from './pages/SearchResults'
import GamePage from './pages/GamePage';

function App() {

  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="my-games" element={<MyGames />}></Route>
          <Route path="profile" element={<Profile />}></Route>
          <Route path='search-results' element={<SearchResults route={{input: ""}}/>}></Route>
          <Route path='game/:id' element={<GamePage/>}></Route>
        </Routes>
      </div>
    </>
  )
}

export default App
