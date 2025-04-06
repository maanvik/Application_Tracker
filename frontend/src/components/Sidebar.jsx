import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    DocumentTextIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import '../styles/Sidebar.css';

function Sidebar() {
    const location = useLocation();

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Applications', href: '/dashboard/applications', icon: DocumentTextIcon },
        { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h1 className="sidebar-title">Job Tracker</h1>
            </div>
            <nav className="sidebar-nav">
                {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
                        >
                            <item.icon className="nav-icon" />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

export default Sidebar;