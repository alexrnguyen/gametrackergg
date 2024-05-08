import { Link, useMatch, useNavigate, useResolvedPath } from "react-router-dom";
import Searchbar from "./Searchbar";
import { useEffect, useState } from "react";

function Navbar() {
  const [signedIn, setSignedIn] = useState(!!localStorage.getItem('username'));
  const navigate = useNavigate();
  function handleSignOut() {
    localStorage.removeItem('username');
    window.location.reload();
  }
  
  useEffect(() => {
    const handleStorageChange = () => {
      setSignedIn(!!localStorage.getItem('username'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  return (
    <nav className="bg-black text-white flex justify-between items-center gap-2 px-4 py-2">
      <div className="flex items-center gap-4 w-1/2">
        <Link className='text-xl' to="/">GameTracker.gg</Link>
        <Searchbar></Searchbar>
      </div>
      <ul className="flex justify-end gap-4 w-1/2">
        {signedIn ? (
          <>
            <CustomLink to="/my-games">My Games</CustomLink>
            <CustomLink to="/profile">Profile</CustomLink>
            <button onClick={() => handleSignOut()}>Sign Out</button>
          </>
        ) : (
          <CustomLink to="/sign-in">Sign In</CustomLink>
        )}
      </ul>
    </nav>
  )
}

function CustomLink({ to, children }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <li>
      <Link className={isActive ? "bg-grey hover:bg-lightgrey" : "hover:bg-lightgrey"} to={to}>{children}</Link>
    </li>
  );
}

export default Navbar;
