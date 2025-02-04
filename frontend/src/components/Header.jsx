
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
    return (
        <header className="header">
            <nav className="nav-links">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
            </nav>
        </header>
    );
}

export default Header;
