import { Link, useMatch, useResolvedPath } from "react-router-dom";
import Searchbar from "./Searchbar";

function Navbar() {
  const path = window.location.pathname;
  return (
    <nav className="bg-black text-white flex justify-between items-center gap-2 px-4 py-2">
      <div className="flex items-center gap-4">
        <Link className='text-xl' to="/">GameTracker.gg</Link>
        <Searchbar></Searchbar>
      </div>
      <ul className="flex gap-4">
        <CustomLink to="/my-games">My Games</CustomLink>
        <CustomLink to="/profile">Profile</CustomLink>
      </ul>
    </nav>
  );
}

function CustomLink({ to, children }) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({ path: resolvedPath.pathname, end: true });
  return (
    <li>
      <Link className={isActive ? "bg-grey" : ""} to={to}>{children}</Link>
    </li>
  );
}

export default Navbar;
