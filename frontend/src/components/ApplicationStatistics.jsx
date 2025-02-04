import React from 'react';
import '../styles/ApplicationStatistics.css';

function ApplicationStatistics({ applications = [] }) {
    if (applications.length === 0) {
        return <div className="stats-container">No applications data available</div>;
    }

    const totalCount = applications.length;
    const inProgressCount = applications.filter(app => app.status !== 'Rejected').length;
    const rejectedCount = applications.filter(app => app.status === 'Rejected').length;

    const appliedCount = applications.filter(app => app.status === 'Applied').length;
    const interviewingCount = applications.filter(app => app.status === 'Interviewing').length;
    const offerCount = applications.filter(app => app.status === 'Offer').length;

    const calculatePercentage = (count) => ((count / totalCount) * 100).toFixed(1);

    return (
        <div className="stats-container">
            <div className="stat-block">
                <h2>Total Applications</h2>
                <p className="stat-number">{totalCount}</p>
            </div>
            <div className="stat-block">
                <h2>In Progress</h2>
                <p className="stat-number">{inProgressCount}</p>
                <div className="progress-bar-container">
                    <label>Applied</label>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${calculatePercentage(appliedCount)}%` }}></div>
                    </div>
                    <span>{calculatePercentage(appliedCount)}%</span>
                </div>
                <div className="progress-bar-container">
                    <label>Interviewing</label>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${calculatePercentage(interviewingCount)}%` }}></div>
                    </div>
                    <span>{calculatePercentage(interviewingCount)}%</span>
                </div>
                <div className="progress-bar-container">
                    <label>Offer</label>
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${calculatePercentage(offerCount)}%` }}></div>
                    </div>
                    <span>{calculatePercentage(offerCount)}%</span>
                </div>
            </div>
            <div className="stat-block">
                <h2>Rejected</h2>
                <p className="stat-number">{rejectedCount}</p>
                <div className="progress-bar-container">
                    <div className="progress-bar">
                        <div className="progress" style={{ width: `${calculatePercentage(rejectedCount)}%` }}></div>
                    </div>
                    <span>{calculatePercentage(rejectedCount)}%</span>
                </div>
            </div>
        </div>
    );
}

export default ApplicationStatistics;