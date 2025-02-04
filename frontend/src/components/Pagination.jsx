import React, { useState } from 'react';
import '../styles/Pagination.css';

function Pagination({ currentPage, totalPages, onPageChange }) {
    const [pageInput, setPageInput] = useState(currentPage);

    const handlePageInput = (e) => {
        const value = parseInt(e.target.value);
        setPageInput(value);
    };

    const handleGoToPage = () => {
        if (pageInput >= 1 && pageInput <= totalPages) {
            onPageChange(pageInput);
        } else {
            setPageInput(currentPage);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
            setPageInput(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
            setPageInput(currentPage + 1);
        }
    };

    return (
        <div className="pagination-container">
            <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`page-button ${currentPage === 1 ? 'page-button-disabled' : 'page-button-active'}`}
            >
                &lt;&lt;
            </button>
            <div className="page-input-group">
                <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={pageInput}
                    onChange={handlePageInput}
                    className="page-input"
                />
                <span className="page-text">
                    of {totalPages}
                </span>
                <button onClick={handleGoToPage} className="go-button">
                    Go
                </button>
            </div>
            <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`page-button ${currentPage === totalPages ? 'page-button-disabled' : 'page-button-active'}`}
                >
                &gt;&gt;
            </button>
        </div>
    );
}

export default Pagination;