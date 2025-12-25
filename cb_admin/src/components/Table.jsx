import React from "react";
import "../css/Table.css";

export default function Table({ columns = [], data = [], actions }) {
    return (
        <table className="table">
            <thead className="table-head">
            <tr>
                {columns.map((col, index) => (
                    <th key={index} className="table-cell">
                        {col.label}
                    </th>
                ))}
                {actions && <th className="table-cell">Actions</th>}
            </tr>
            </thead>

            <tbody className="table-body">
            {data.map(item => (
                <tr key={item.id} className="table-row">
                    {columns.map((col, index) => (
                        <td key={index} className="table-cell">
                            {col.render ? col.render(item) : item[col.key]}
                        </td>
                    ))}

                    {actions && (
                        <td className="table-actions">
                            {actions.map(a => (
                                <button key={a.label} className={`btn btn-${a.type}`} onClick={() => a.onClick(item)}>
                                    {a.label}
                                </button>
                            ))}
                        </td>
                    )}
                </tr>
            ))}
            </tbody>
        </table>
    );
}
