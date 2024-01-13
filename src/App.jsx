import './styles.css'
import Home from "./pages/Home";
import MyGames from "./pages/MyGames";
import Profile from "./pages/Profile";
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import SearchResults from './pages/SearchResults'
import GamePage from './pages/GamePage';
import Footer from './components/Footer';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

function App() {

  return (
    <div className='flex flex-col flex-nowrap min-h-screen'>
      <Navbar />
      <div className="flex-grow w-full">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="my-games" element={<MyGames />}/>
          <Route path="profile" element={<Profile />}/>
          <Route path='search-results' element={<SearchResults route={{input: ""}}/>}/>
          <Route path='game/:id' element={<GamePage/>}/>
          <Route path='sign-in' element={<SignIn/>}/>
          <Route path='sign-up' element={<SignUp/>}/>
        </Routes>
      </div>
      <Footer></Footer>
    </div>
  )
}

export default App
