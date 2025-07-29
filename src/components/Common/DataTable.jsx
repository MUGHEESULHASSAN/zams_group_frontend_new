"use client"
import "./DataTable.css"

const DataTable = ({ columns, data, onEdit, onDelete, onView }) => {
  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={column.className || ""}>
                {column.header}
              </th>
            ))}
            <th className="actions-column">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={column.className || ""}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
              <td className="actions-cell">
                <div className="action-buttons">
                  {onView && (
                    <button className="action-btn view-btn" onClick={() => onView(row)} title="View">
                      👁️
                    </button>
                  )}
                  {onEdit && (
                    <button className="action-btn edit-btn" onClick={() => onEdit(row)} title="Edit">
                      ✏️
                    </button>
                  )}
                  {onDelete && (
                    <button className="action-btn delete-btn" onClick={() => onDelete(row)} title="Delete">
                      🗑️
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && <div className="no-data">No data available</div>}
    </div>
  )
}

export default DataTable
