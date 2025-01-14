import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/rent">Rent a bike</Link></li>
        <li><Link to="/return">Return bike</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
