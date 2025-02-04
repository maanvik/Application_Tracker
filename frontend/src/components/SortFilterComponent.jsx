import React from 'react';

function SortFilterComponent({ onSort, onFilter }) {
    return (
        <div className="sort-filter">
            <select onChange={(e) => onSort(e.target.value)}>
                <option value="date_applied">Date Applied</option>
                <option value="company_name">Company</option>
                <option value="position">Role</option>
                <option value="status">Status</option>
            </select>
            <select onChange={(e) => onFilter(e.target.value, '')}>
                <option value="">No Filter</option>
                <option value="company_name">Company</option>
                <option value="position">Role</option>
                <option value="status">Status</option>
            </select>
            <input
                type="text"
                placeholder="Filter value"
                onChange={(e) => onFilter(document.querySelector('.sort-filter select:nth-child(2)').value, e.target.value)}
            />
        </div>
    );
}

export default SortFilterComponent;