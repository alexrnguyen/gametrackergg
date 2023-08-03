import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import './styles.css'
import Home from "./pages/Home";
import MyGames from "./pages/MyGames";
import Profile from "./pages/Profile";
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar></Navbar>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="my-games" element={<MyGames />}></Route>
          <Route path="profile" element={<Profile />}></Route>
        </Routes>
      </div>
    </>
  )
}

export default App
