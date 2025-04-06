import React, { useState, useCallback } from 'react';
import '../styles/SortFilterComponent.css';
import { debounce } from 'lodash';

function SortFilterComponent({ onSort, onFilter, initialFilters }) {
    const [sortColumn, setSortColumn] = useState('date_applied');
    const [sortDirection, setSortDirection] = useState('desc');
    const [filters, setFilters] = useState(initialFilters || {
        search: '',
        status: '',
        startDate: '',
        endDate: ''
    });

    const debouncedFilter = useCallback(
        debounce((newFilters) => {
            onFilter(newFilters);
        }, 300),
        [onFilter]
    );

    const handleFilterChange = useCallback((type, value) => {
        const newFilters = { ...filters, [type]: value };
        setFilters(newFilters);
        debouncedFilter(newFilters);
    }, [filters, debouncedFilter]);

    const handleSort = (column) => {
        const newDirection = column === sortColumn && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(newDirection);
        onSort(column, newDirection);
    };

    return (
        <div className="sort-filter-container">
            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search applications..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="filter-section">
                <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="status-filter"
                >
                    <option value="">All Statuses</option>
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                </select>

                <div className="date-filter">
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => handleFilterChange('startDate', e.target.value)}
                        className="date-input"
                    />
                    <span>to</span>
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => handleFilterChange('endDate', e.target.value)}
                        className="date-input"
                    />
                </div>
            </div>

            <div className="sort-section">
                <select
                    onChange={(e) => handleSort(e.target.value)}
                    value={sortColumn}
                    className="sort-select"
                >
                    <option value="date_applied">Date Applied</option>
                    <option value="company_name">Company</option>
                    <option value="position">Role</option>
                    <option value="status">Status</option>
                </select>
                <button
                    onClick={() => handleSort(sortColumn)}
                    className="sort-button"
                    title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                    {sortDirection === 'asc' ? '↑' : '↓'}
                </button>
            </div>
        </div>
    );
}

export default SortFilterComponent;