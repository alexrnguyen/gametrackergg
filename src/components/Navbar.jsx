import { Link, useMatch, useResolvedPath } from "react-router-dom";
import Searchbar from "./Searchbar";

function Navbar() {
  return (
    <nav className="bg-black text-white flex justify-between items-center gap-2 px-4 py-2">
      <div className="flex items-center gap-4 w-1/2">
        <Link className='text-xl' to="/">GameTracker.gg</Link>
        <Searchbar></Searchbar>
      </div>
      <ul className="flex justify-end gap-4 w-1/2">
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
      <Link className={isActive ? "bg-grey hover:bg-lightgrey" : "hover:bg-lightgrey"} to={to}>{children}</Link>
    </li>
  );
}

export default Navbar;
