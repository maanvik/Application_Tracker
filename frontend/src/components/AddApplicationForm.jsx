import React, { useState } from 'react';
import "../styles/AddApplicationForm.css";
import axios from 'axios';


function AddApplicationForm({ onClose, onApplicationAdded }) {
    const [formData, setFormData] = useState({
        company_name: '',
        position: '',
        job_url: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/applications', formData);
            setFormData({ company_name: '', position: '', job_url: '' });
            if (onApplicationAdded) onApplicationAdded();
            onClose();
        } catch (error) {
            console.error('Error adding application:', error);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} title="Close">&times;</button>
                <h2>Add New Application</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="company_name">Company Name</label>
                        <input
                            type="text"
                            id="company_name"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="position">Position</label>
                        <input
                            type="text"
                            id="position"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="job_url">Job URL</label>
                        <input
                            type="url"
                            id="job_url"
                            name="job_url"
                            value={formData.job_url}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" >Add Application</button>
                </form>
            </div>
        </div>
    );
}

export default AddApplicationForm;
