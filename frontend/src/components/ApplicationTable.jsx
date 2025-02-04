import React, { useState } from 'react';
import axios from 'axios';
import "../styles/ApplicationTable.css"

function ApplicationTable({ applications, onApplicationUpdated }) {
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    const handleEdit = (id) => {
        setEditingId(id);
        setEditData(applications.find(app => app.id === id));
    };

    const handleSave = async (id) => {
        try {
            await axios.put(`/api/applications/${id}`, editData);
            setEditingId(null);
            onApplicationUpdated();
        } catch (error) {
            console.error('Error updating application:', error);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditData({});
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                await axios.delete(`/api/applications/${id}`);
                onApplicationUpdated();
            } catch (error) {
                console.error('Error deleting application:', error);
            }
        }
    };

    const handleChange = (e, field) => {
        setEditData({ ...editData, [field]: e.target.value });
    };

    return (
        <div className="ApplicationTable">
            <table>
                <thead>
                    <tr>
                        <th>Date Applied</th>
                        <th>Company</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Job URL</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applications && applications.length > 0 ? (
                        applications.map((app) => (
                            <tr key={app.id}>
                                <td>{new Date(app.date_applied).toLocaleDateString()}</td>
                                <td>
                                    {editingId === app.id ? (
                                        <input
                                            type="text"
                                            value={editData.company_name || app.company_name}
                                            onChange={(e) => handleChange(e, 'company_name')}
                                        />
                                    ) : (
                                        app.company_name
                                    )}
                                </td>
                                <td>
                                    {editingId === app.id ? (
                                        <input
                                            type="text"
                                            value={editData.position || app.position}
                                            onChange={(e) => handleChange(e, 'position')}
                                        />
                                    ) : (
                                        app.position
                                    )}
                                </td>
                                <td>
                                    {editingId === app.id ? (
                                        <select
                                            value={editData.status || app.status}
                                            onChange={(e) => handleChange(e, 'status')}
                                        >
                                            <option value="Applied">Applied</option>
                                            <option value="Interviewing">Interviewing</option>
                                            <option value="Offer">Offer</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    ) : (
                                        app.status
                                    )}
                                </td>
                                <td>
                                    {editingId === app.id ? (
                                        <input
                                            type="text"
                                            value={editData.job_url || app.job_url}
                                            onChange={(e) => handleChange(e, 'job_url')}
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
                                    {editingId === app.id ? (
                                        <>
                                            <button onClick={() => handleSave(app.id)}>Save</button>
                                            <button onClick={handleCancel}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEdit(app.id)}>Edit</button>
                                            <button onClick={() => handleDelete(app.id)}>Remove</button>
                                        </>
                                    )}
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
        </div>
    );
}

export default ApplicationTable;