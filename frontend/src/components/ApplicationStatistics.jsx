import React from 'react';
import '../styles/ApplicationStatistics.css';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ApplicationStatistics({ applications = [] }) {
    if (applications.length === 0) {
        return <div className="stats-container empty-state">No applications data available</div>;
    }

    const totalCount = applications.length;
    const rejectedCount = applications.filter(app => app.status === 'Rejected').length;
    const UnRejectedCount = totalCount - rejectedCount;

    const interviewingCount = applications.filter(app => app.status === 'Interviewing').length;
    const offerCount = applications.filter(app => app.status === 'Offer').length;
    const inProgressCount = UnRejectedCount - interviewingCount - offerCount;

    const donutData = [
        { name: 'In Progress', value: parseFloat(((inProgressCount / totalCount) * 100).toFixed(1)), count: inProgressCount },
        { name: 'Interviewing', value: parseFloat(((interviewingCount / totalCount) * 100).toFixed(1)), count: interviewingCount },
        { name: 'Offer', value: parseFloat(((offerCount / totalCount) * 100).toFixed(1)), count: offerCount },
        { name: 'Rejected', value: parseFloat(((rejectedCount / totalCount) * 100).toFixed(1)), count: rejectedCount }
    ];

    const COLORS = ['#6366f1', '#fbbf24', '#34d399', '#ef4444'];

    return (
        <div className="stats-container">
            <div className="stats-header">
                <h2>Applications Overview</h2>
                <div className="total-applications">
                    <span className="total-number">{totalCount}</span>
                    <span className="total-label">Total Applications</span>
                </div>
            </div>

           

            <div className="stats-detail-section">
                <div className="stats-bars">
                    <div className="bar-section">
                        <h3>Active Applications Progress</h3>
                        <div className="bar-container">
                            <div
                                className="bar-segment"
                                style={{
                                    width: `${(inProgressCount / UnRejectedCount) * 100}%`,
                                    background: `linear-gradient(to right, ${COLORS[0]}dd, ${COLORS[0]})`
                                }}
                                title={`In Progress: ${inProgressCount}`}
                            >
                                {inProgressCount > 0 && inProgressCount}
                            </div>
                            <div
                                className="bar-segment"
                                style={{
                                    width: `${(interviewingCount / UnRejectedCount) * 100}%`,
                                    background: `linear-gradient(to right, ${COLORS[1]}dd, ${COLORS[1]})`
                                }}
                                title={`Interviewing: ${interviewingCount}`}
                            >
                                {interviewingCount > 0 && interviewingCount}
                            </div>
                            <div
                                className="bar-segment"
                                style={{
                                    width: `${(offerCount / UnRejectedCount) * 100}%`,
                                    background: `linear-gradient(to right, ${COLORS[2]}dd, ${COLORS[2]})`
                                }}
                                title={`Offer: ${offerCount}`}
                            >
                                {offerCount > 0 && offerCount}
                            </div>
                        </div>
                        <div className="bar-legend">
                            {['In Progress', 'Interviewing', 'Offer'].map((label, index) => (
                                <div key={label} className="legend-item">
                                    <div className="legend-color" style={{ backgroundColor: COLORS[index] }}></div>
                                    <span>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bar-section">
                        <h3>Rejected</h3>
                        <div className="bar-container">
                            <div
                                className="bar-segment"
                                style={{
                                    width: `${(rejectedCount / totalCount) * 100}%`,
                                    background: `linear-gradient(to right, ${COLORS[3]}dd, ${COLORS[3]})`
                                }}
                                title={`Rejected: ${rejectedCount}`}
                            >
                                {rejectedCount > 0 && rejectedCount }
                            </div>
                        </div>
                        <div className="bar-legend">
                            <div className="legend-item">
                                <div className="legend-color" style={{ backgroundColor: COLORS[3] }}></div>
                                <span>Rejected</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stats-chart">
                    <h3>Overall Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={donutData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {donutData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index]}
                                        stroke={COLORS[index]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value, name) => [
                                     `${value}%`,
                                    name
                                ]}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value, entry) => (
                                    <span style={{ color: '#666', fontSize: '0.9rem' }}>{value}</span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default ApplicationStatistics;