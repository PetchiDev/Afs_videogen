import React from 'react';
import PropTypes from 'prop-types';
import styles from './Table.module.css';

/**
 * Reusable Table component
 * @param {Array} columns - Array of column definitions
 * @param {Array} data - Array of data objects
 * @param {Function} onSort - Callback for sorting (columnKey, direction)
 * @param {Object} sortConfig - Current sort configuration { key, direction }
 */
const Table = ({ columns, data, pagination, loading }) => {
  const { current, pageSize, total, onChange } = pagination || {};
  const totalPages = Math.ceil(total / pageSize);

  const handlePrev = () => {
    if (current > 1) onChange(current - 1);
  };

  const handleNext = () => {
    if (current < totalPages) onChange(current + 1);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            {columns.map((column, index) => (
              <th
                key={column.key || index}
                className={styles.th}
                style={{ width: column.width, textAlign: column.align || 'left' }}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className={styles.loadingData}>
                <div className={styles.loadingContainer}>
                  <div className={styles.spinner}></div>
                  <span>Loading Data</span>
                </div>
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className={styles.tr}>
                {columns.map((column, colIndex) => (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    className={styles.td}
                    style={{ textAlign: column.align || 'left' }}
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className={styles.noData}>
                No Data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {pagination && total > 0 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Showing {((current - 1) * pageSize) + 1} to {Math.min(current * pageSize, total)} of {total} results
          </div>
          <div className={styles.paginationControls}>
            <button
              className={styles.pageButton}
              onClick={handlePrev}
              disabled={current === 1}
            >
              Previous
            </button>
            <span className={styles.pageStatus}>Page {current} of {totalPages}</span>
            <button
              className={styles.pageButton}
              onClick={handleNext}
              disabled={current === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      title: PropTypes.string.isRequired,
      render: PropTypes.func,
      sortable: PropTypes.bool,
      width: PropTypes.string,
      align: PropTypes.string,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Table;
