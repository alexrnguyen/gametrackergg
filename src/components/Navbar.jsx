import React from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import Searchbar from "./Searchbar";

function Navbar() {
  const path = window.location.pathname;
  return (
    <nav className="nav">
      <Link className='site-name' to="/">GameTracker.gg</Link>
      <Searchbar></Searchbar>
      <ul className="links">
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
    <li className={isActive ? "active" : ""}>
      <Link to={to}>{children}</Link>
    </li>
  );
}

export default Navbar;
