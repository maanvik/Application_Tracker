import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import '../styles/registration.css';

function Registration() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: ''
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage('');
        setIsError(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirm_password) {
            setMessage('Passwords do not match');
            setIsError(true);
            return;
        }

        if (formData.password.length < 6) {
            setMessage('Password must be at least 6 characters long');
            setIsError(true);
            return;
        }

        try {
            axios.defaults.baseURL = 'http://localhost:5000';
            axios.defaults.withCredentials = true;

            const response = await axios.post('/api/register', {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            if (response.status === 201) {
                setMessage('Registration successful!');
                setIsError(false);
                setTimeout(() => navigate('/login'), 2000); 
            }
        } catch (error) {
            console.error('Error registering:', error);
            setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
            setIsError(true);
        }
    };

    return (
        <div className="registration-page">
            <Header />
            <div className="registration-container">
                <div className="registration-form-wrapper">
                    <h2 className="form-title">Register</h2>
                    <form onSubmit={handleSubmit} className="registration-form">
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="form-input"
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="form-input"
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm_password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                        <button type="submit" className="form-submit-button">Register</button>
                        {message && (
                            <div className={`message ${isError ? 'error' : 'success'}`}>
                                {message}
                            </div>
                        )}
                    </form>
                    <p className="form-footer">
                        Already have an account?{' '}
                        <Link to="/login" className="form-link">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Registration;
