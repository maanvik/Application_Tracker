import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddApplicationForm from './AddApplicationForm';
import ApplicationTable from './ApplicationTable';
import Pagination from './Pagination';
import SortFilterComponent from './SortFilterComponent';
import ApplicationStatistics from './ApplicationStatistics';
import axios from 'axios';
import '../styles/Dashboard.css';

function Dashboard() {
    const [applications, setApplications] = useState([]);
    const [statsApplications, setStatsApplications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('date_applied');
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterBy, setFilterBy] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchApplications();
        fetchStatsApplications();
    }, [currentPage, sortBy, sortOrder, filterBy, filterValue]);

    const fetchApplications = async () => {
        try {
            const response = await axios.get('/api/applications', {
                params: {
                    page: currentPage,
                    sort_by: sortBy,
                    sort_order: sortOrder,
                    filter_by: filterBy,
                    filter_value: filterValue
                }
            });
            setApplications(response.data.applications);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error('Error fetching applications:', error);
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

    const handleApplicationUpdate = () => {
        fetchApplications();
        fetchStatsApplications();
    };

    const handleLogout = async () => {
        try {
            await axios.get('/api/logout');
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className="dashboard">
            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-content">
                        <div className="flex items-center">
                            <h1 className="navbar-title">Job Application Tracker</h1>
                        </div>
                        <div className="flex items-center">
                            <button onClick={handleLogout} className="logout-button">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="content-grid">
                    <AddApplicationForm onApplicationAdded={handleApplicationUpdate} className="ApplicationForm"/>
                    <div className="content-card">
                        <h2>Your Job Applications</h2>
                        <SortFilterComponent
                            onSort={setSortBy}
                            onFilter={(by, value) => {
                                setFilterBy(by);
                                setFilterValue(value);
                            }}
                        />
                        <ApplicationTable
                            applications={applications}
                            onApplicationUpdated={handleApplicationUpdate}
                        />
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                    <ApplicationStatistics applications={statsApplications} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;