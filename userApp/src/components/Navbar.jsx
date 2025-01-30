import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-header">
        <h1 className="logo">Scooter Rental Service App</h1>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✖ Close" : "☰ Menu"}
        </button>
      </div>
      {menuOpen && (
        <ul className="nav-links">
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/Login" onClick={() => setMenuOpen(false)}>Login</Link></li>
          <li><Link to="/Register" onClick={() => setMenuOpen(false)}>Create Account</Link></li>
          <li><Link to="/About" onClick={() => setMenuOpen(false)}>About</Link></li>
          <li><Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link></li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;