import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SortFilterComponent from './SortFilterComponent';
import Pagination from './Pagination';
import "../styles/ApplicationTable.css";

function ApplicationTable({ applications: propApplications, onApplicationUpdated, simplified = false }) {
    const navigate = useNavigate();
    const [allApplications, setAllApplications] = useState([]); 
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('date_applied');
    const [sortOrder, setSortOrder] = useState('desc');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [confirmingId, setConfirmingId] = useState(null);
    const [filters, setFilters] = useState({
        search: '',
        status: '',
        startDate: '',
        endDate: ''
    });

    
    const fetchApplications = useCallback(async () => {
        if (propApplications) {
            setAllApplications(propApplications);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError('');
            const response = await axios.get('/api/applications/stats'); 
            setAllApplications(response.data.applications);
        } catch (error) {
            console.error('Error fetching applications:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                setError('Failed to load applications. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate, propApplications]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);

    
    const filteredApplications = useMemo(() => {
        let result = [...allApplications];

        // Apply search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            result = result.filter(app =>
                app.company_name.toLowerCase().includes(searchTerm) ||
                app.position.toLowerCase().includes(searchTerm)
            );
        }

        // Apply status filter
        if (filters.status) {
            result = result.filter(app => app.status === filters.status);
        }

        // Apply date filters
        if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            result = result.filter(app => new Date(app.date_applied) >= startDate);
        }

        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59); 
            result = result.filter(app => new Date(app.date_applied) <= endDate);
        }

        // Apply sorting
        result.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'date_applied') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            }
            return aValue < bValue ? 1 : -1;
        });

        return result;
    }, [allApplications, filters, sortBy, sortOrder]);

    
    const ITEMS_PER_PAGE = 10;
    const paginatedApplications = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredApplications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredApplications, currentPage]);

    const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);

    useEffect(() => {
        
        setCurrentPage(1);
    }, [filters]);

    const handleEdit = (id) => {
        setEditingId(id);
        setEditData(allApplications.find(app => app.id === id));
    };

    const handleSave = async (id) => {
        try {
            setError('');
            await axios.put(`/api/applications/${id}`, editData);
            setEditingId(null);

          
            setAllApplications(prev =>
                prev.map(app => app.id === id ? { ...app, ...editData } : app)
            );

            if (onApplicationUpdated) {
                onApplicationUpdated();
            }
        } catch (error) {
            console.error('Error updating application:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                setError('Failed to update application. Please try again.');
            }
        }
    };

    const handleDelete = async (id) => {
        try {
            setError('');
            await axios.delete(`/api/applications/${id}`);

            
            setAllApplications(prev => prev.filter(app => app.id !== id));
            setConfirmingId(null);

            if (onApplicationUpdated) {
                onApplicationUpdated();
            }
        } catch (error) {
            console.error('Error deleting application:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            } else {
                setError('Failed to delete application. Please try again.');
            }
        }
    };

    const handleSort = useCallback((column) => {
        setSortOrder(prevOrder => column === sortBy ? (prevOrder === 'asc' ? 'desc' : 'asc') : 'desc');
        setSortBy(column);
    }, [sortBy]);

    const handleFilter = useCallback((newFilters) => {
        setFilters(newFilters);
    }, []);

    if (loading) {
        return <div className="loading-message">Loading applications...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="ApplicationTable">
            {!simplified && (
                <SortFilterComponent
                    onSort={handleSort}
                    onFilter={handleFilter}
                    initialFilters={filters}
                />
            )}

            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('date_applied')}>
                            Date Applied {sortBy === 'date_applied' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('company_name')}>
                            Company {sortBy === 'company_name' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('position')}>
                            Role {sortBy === 'position' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('status')}>
                            Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th>Job URL</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedApplications.length > 0 ? (
                        paginatedApplications.map((app) => (
                            <tr key={app.id}>
                                <td>{new Date(app.date_applied).toLocaleDateString()}</td>
                                <td className={editingId === app.id ? 'editable-cell' : ''}>
                                    {editingId === app.id ? (
                                        <input
                                            type="text"
                                            value={editData.company_name || app.company_name}
                                            onChange={(e) => setEditData({ ...editData, company_name: e.target.value })}
                                        />
                                    ) : (
                                        app.company_name
                                    )}
                                </td>
                                <td className={editingId === app.id ? 'editable-cell' : ''}>
                                    {editingId === app.id ? (
                                        <input
                                            type="text"
                                            value={editData.position || app.position}
                                            onChange={(e) => setEditData({ ...editData, position: e.target.value })}
                                        />
                                    ) : (
                                        app.position
                                    )}
                                </td>
                                <td className={editingId === app.id ? 'editable-cell' : ''}>
                                    {editingId === app.id ? (
                                        <select
                                            value={editData.status || app.status}
                                            onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                        >
                                            <option value="Applied">Applied</option>
                                            <option value="Interviewing">Interviewing</option>
                                            <option value="Offer">Offer</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    ) : (
                                        <span className={`status-badge status-${app.status.toLowerCase()}`}>
                                            {app.status}
                                        </span>
                                    )}
                                </td>
                                <td className={editingId === app.id ? 'editable-cell' : ''}>
                                    {editingId === app.id ? (
                                        <input
                                            type="text"
                                            value={editData.job_url || app.job_url}
                                            onChange={(e) => setEditData({ ...editData, job_url: e.target.value })}
                                        />
                                    ) : app.job_url ? (
                                        <a href={app.job_url} target="_blank" rel="noopener noreferrer">
                                            View Job
                                        </a>
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        {editingId === app.id ? (
                                            <>
                                                <button className="save-btn" onClick={() => handleSave(app.id)}>Save</button>
                                                <button className="cancel-btn" onClick={() => {
                                                    setEditingId(null);
                                                    setEditData({});
                                                }}>Cancel</button>
                                            </>
                                        ) : confirmingId === app.id ? (
                                            <>
                                                <button className="confirm-btn" onClick={() => handleDelete(app.id)}>Yes</button>
                                                <button className="cancel-btn" onClick={() => setConfirmingId(null)}>No</button>
                                            </>
                                        ) : (
                                            <>
                                                <button className="edit-btn" onClick={() => handleEdit(app.id)}>Edit</button>
                                                <button className="remove-btn" onClick={() => setConfirmingId(app.id)}>Remove</button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No applications found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {!simplified && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
}

export default ApplicationTable;