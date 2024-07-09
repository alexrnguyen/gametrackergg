import './styles.css'
import Home from "./pages/Home";
import MyGames from "./pages/MyGames";
import Profile from "./pages/Profile";
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import SearchResultsPage from './pages/SearchResultsPage'
import GamePage from './pages/GamePage';
import Footer from './components/Footer';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Following from './pages/Following';
import Followers from './pages/Followers';

function App() {

  return (
    <div className='flex flex-col flex-nowrap min-h-screen'>
      <Navbar />
      <div className="flex-grow w-full pl-16 pr-16">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="my-games" element={<MyGames />}/>
          <Route path="profile" element={<Profile />}/>
          <Route path='following/:uid' element={<Following />}/>
          <Route path='followers/:uid' element={<Followers />}/>
          <Route path='search-results' element={<SearchResultsPage route={{input: ""}}/>}/>
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
