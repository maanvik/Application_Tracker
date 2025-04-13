import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApplicationStatistics from './ApplicationStatistics';
import ApplicationTable from './ApplicationTable';
import AddApplicationForm from './AddApplicationForm';
import axios from 'axios';
import '../styles/DashboardHome.css';

function DashboardHome() {
    const [recentApplications, setRecentApplications] = useState([]);
    const [statsApplications, setStatsApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

    useEffect(() => {
        fetchRecentApplications();
        fetchStatsApplications();
    }, []);

    const fetchRecentApplications = async () => {
        try {
            const response = await axios.get('/api/applications', {
                params: {
                    page: 1,
                    per_page: 5,
                    sort_by: 'date_applied',
                    sort_order: 'desc'
                }
            });
            setRecentApplications(response.data.applications);
        } catch (error) {
            console.error('Error fetching recent applications:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatsApplications = async () => {
        try {
            const response = await axios.get('/api/applications/stats');
            setStatsApplications(response.data.applications);
        } catch (error) {
            console.error('Error fetching statistics:', error);
        }
    };

    const handleApplicationAdded = () => {
        fetchRecentApplications();
        fetchStatsApplications();
    };

    return (
        <div className="dashboard-home">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Dashboard Overview</h1>
                <div className="header-actions">
                    <div className="command-palette-tip">
                        <span>Quick navigation:</span>
                        <div className="keyboard-shortcut">
                            <span className="key">{isMac ? '⌘' : 'Ctrl'}</span>
                            <span>+</span>
                            <span className="key">K</span>
                        </div>
                    </div>
                    <button onClick={() => setShowAddForm(true)} className="add-application-button">
                        Add Application
                    </button>
                </div>
            </div>

            <div className="stats-section">
                <ApplicationStatistics applications={statsApplications} />
            </div>

            <div className="recent-applications">
                <div className="section-header">
                    <h2 className="section-title">Recent Applications</h2>
                    <div className="section-actions">
                        
                        <Link to="/dashboard/applications" className="view-all-link">
                            View All
                        </Link>
                    </div>
                </div>
                {loading ? (
                    <p>Loading applications...</p>
                ) : (
                     <ApplicationTable
                          applications={recentApplications}
                          onApplicationUpdated={handleApplicationAdded}
                          simplified={true}
                      />

                )}
            </div>

            {showAddForm && (
                <AddApplicationForm
                    onClose={() => setShowAddForm(false)}
                    onApplicationAdded={handleApplicationAdded}
                />
            )}
        </div>
    );
}

export default DashboardHome;