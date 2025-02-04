import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../styles/Login.css';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', formData);
            if (response.status === 200) {
                setMessage('Login successful!');
                setIsError(false);
                localStorage.setItem('token', response.data.token);
                setTimeout(() => navigate('/dashboard'), 2000); 
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setMessage('Login failed. Please check your credentials.');
            setIsError(true);
        }
    };

    return (
        <div className="login-page">
            <Header />
            <div className="login-container">
                <div className="login-card">
                    <h2 className="login-title">Login</h2>
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="login-button">Login</button>
                        {message && (
                            <div className={`message ${isError ? 'error' : 'success'}`}>
                                {message}
                            </div>
                        )}
                    </form>
                    <p className="register-link">
                        Don't have an account? <a href="/register">Register here</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
