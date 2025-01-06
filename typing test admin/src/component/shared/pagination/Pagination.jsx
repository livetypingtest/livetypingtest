const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    return (
        <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end">
                {pageNumbers.map((page) => (
                    <li className="page-item ">
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            tabIndex={-1} 
                            className={'page-link '+(page === currentPage ? 'active' : '')}
                        >
                            {page}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination
