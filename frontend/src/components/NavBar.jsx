
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isLoggedIn }) => {
    return (
        <div className="navbar">
            <div className="navbar-container">
                <h1 className="navbar-title">Your Application</h1>
                {!isLoggedIn && (
                    <div className="navbar-menu">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link">Register</Link>
                        <Link to="/about" className="nav-link">About</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
