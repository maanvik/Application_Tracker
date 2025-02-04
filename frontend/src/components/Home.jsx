import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import '../styles/Home.css';

function Home() {
    return (
        <div className="home-page">
            <Header />
            <div className="home-container">
                <div className="home-card">
                    <h1 className="home-title">
                        Job Application Tracker
                    </h1>
                    <p className="home-description">
                        Track and manage your job applications in one place
                    </p>
                    <div className="button-container">
                        <Link to="/login" className="login-button">
                            Login
                        </Link>
                        <Link to="/register" className="register-button">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
