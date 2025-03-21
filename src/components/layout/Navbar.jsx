import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          PGConnect
        </Link>
        <div className="nav-menu">
          <Link to="/find-pg" className="nav-link">Find PG</Link>
          <Link to="/list-property" className="nav-link">List Property</Link>
          <Link to="/find-roommate" className="nav-link">Find Roommate</Link>
          <Link to="/profile" className="nav-button">Profile</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
