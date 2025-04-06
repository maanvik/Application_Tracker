import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

function Profile() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedUsername, setEditedUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get('/api/user');
            setUser(response.data);
            setEditedUsername(response.data.username);
        } catch (error) {
            console.error('Error fetching user data:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        }
    };

    const handleUsernameUpdate = async () => {
        try {
            setError('');
            await axios.put('/api/user', { username: editedUsername });
            setUser(prev => ({ ...prev, username: editedUsername }));
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating username:', error);
            setError(error.response?.data?.message || 'Failed to update username');
        }
    };

    const handleLogout = async () => {
        try {
            await axios.get('/api/logout');
            navigate('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if (!user) {
        return <div className="profile-loading">Loading...</div>;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2 className="profile-title">Profile Settings</h2>

                {error && <div className="error-message">{error}</div>}

                <div className="profile-section">
                    <div className="profile-field">
                        <label>Username</label>
                        {isEditing ? (
                            <div className="edit-field">
                                <input
                                    type="text"
                                    value={editedUsername}
                                    onChange={(e) => setEditedUsername(e.target.value)}
                                    className="username-input"
                                />
                                <div className="edit-actions">
                                    
                                    <span
                                        className="save-link"
                                        onClick={handleUsernameUpdate}
                                    >
                                        Save
                                    </span>
                                    <span
                                        className="cancel-link"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditedUsername(user.username);
                                        }}
                                        >
                                        Cancel
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="display-field">
                                <span>{user.username}</span>
                                <span className="edit-link" onClick={() => setIsEditing(true)}>Edit</span>
                            </div>
                        )}
                    </div>

                    <div className="profile-field">
                        <label>Email</label>
                        <div className="display-field">
                            <span>{user.email}</span>
                        </div>
                    </div>
                </div>

                <div className="profile-actions">
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;