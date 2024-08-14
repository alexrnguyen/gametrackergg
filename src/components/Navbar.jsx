import { Link, useMatch, useResolvedPath, useLocation } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdClose } from "react-icons/io";
import Searchbar from "./Searchbar";
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

function MobileMenu({signedIn, handleSignOut}) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // close menu when URL changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      {menuOpen ? 
        <ul className="flex flex-col gap-4 flex-grow">
          {signedIn ? (
            <div className="flex flex-col">
              <IoMdClose className="self-end" onClick={() => setMenuOpen(false)} />
              <div id="nav-hamburger-menu" className="flex flex-col gap-4 fixed right-8 top-12 bg-grey z-10 p-8">
                <CustomLink className="text-start" to="/my-games">My Games</CustomLink>
                <CustomLink className="text-start" to="/profile">Profile</CustomLink>
                <button className="text-start hover:bg-lightgrey" onClick={() => handleSignOut()}>Sign Out</button>
              </div>
            </div>
          ): (
            <CustomLink to="/sign-in">Sign In</CustomLink>
          )}
        </ul> 
        : <RxHamburgerMenu onClick={() => setMenuOpen(true)} />}
    </>
  );
}

function Navbar() {
  const [signedIn, setSignedIn] = useState(!!Cookies.get('userId'));
  const isMobile = useMediaQuery({maxWidth: "768px"});

  function handleSignOut() {
    Cookies.remove('userId');
    Cookies.remove('token');
    window.location.reload();
  }
  
  useEffect(() => {
    const handleStorageChange = () => {
      setSignedIn(!!Cookies.get("userId"));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  return (
    <nav className="bg-black text-white flex justify-between items-center gap-2 px-4 md:px-16 py-2">
      <div className="flex items-center gap-4">
        <Link className='text-lg md:text-xl' to="/">GameTracker.gg</Link>
        <Searchbar></Searchbar>
      </div>

      {isMobile ? <MobileMenu signedIn={signedIn} handleSignOut={handleSignOut} /> 
        : (
          <ul className="flex justify-end gap-4 flex-grow">
            {signedIn ? (
              <>
                <CustomLink to="/my-games">My Games</CustomLink>
                <CustomLink to="/profile">Profile</CustomLink>
                <button className="hover:bg-lightgrey" onClick={() => handleSignOut()}>Sign Out</button>
              </>
            ) : (
              <CustomLink className="hover:bg-lightgrey" to="/sign-in">Sign In</CustomLink>
            )}
          </ul>
        )
      }
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
