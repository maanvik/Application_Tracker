import React, { useState, useEffect } from 'react';
import '../styles/Pagination.css';

function Pagination({ currentPage, totalPages, onPageChange }) {
    const [pageInput, setPageInput] = useState(currentPage);

    useEffect(() => {
        setPageInput(currentPage);
    }, [currentPage]);

    const handlePageInput = (e) => {
        const value = e.target.value;
        if (value === '' || (Number(value) >= 0 && Number(value) <= totalPages)) {
            setPageInput(value);
        }
    };

    const handleGoToPage = () => {
        const page = parseInt(pageInput);
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        } else {
            setPageInput(currentPage);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleGoToPage();
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="pagination-container">
            <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`page-button ${currentPage === 1 ? 'page-button-disabled' : ''}`}
                aria-label="Previous page"
            >
                Previous
            </button>

            <div className="page-input-group">
                <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={pageInput}
                    onChange={handlePageInput}
                    onKeyPress={handleKeyPress}
                    className="page-input"
                    aria-label="Page number"
                />
                <span className="page-text">of {totalPages}</span>
                <button
                    onClick={handleGoToPage}
                    className="go-button"
                    aria-label="Go to page"
                >
                    Go
                </button>
            </div>

            <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`page-button ${currentPage === totalPages ? 'page-button-disabled' : ''}`}
                aria-label="Next page"
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;