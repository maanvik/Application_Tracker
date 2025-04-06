import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AddApplicationForm from './AddApplicationForm';
import ApplicationTable from './ApplicationTable';
import DashboardHome from './DashboardHome';
import Profile from './Profile';
import Sidebar from './Sidebar';
import CommandPalette from './CommandPalette';
import axios from 'axios';
import '../styles/Dashboard.css';

function Dashboard() {
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandPaletteOpen(prev => !prev);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="dashboard">
            <Sidebar />
            <CommandPalette
                isOpen={isCommandPaletteOpen}
                onClose={() => setIsCommandPaletteOpen(false)}
            />

            <div className="dashboard-main">
                <div className="dashboard-content">
                    <Routes>
                        <Route path="/" element={<DashboardHome />} />
                        <Route path="applications" element={<ApplicationTable />} />
                        <Route path="add" element={<AddApplicationForm />} />
                        <Route path="profile" element={<Profile />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;