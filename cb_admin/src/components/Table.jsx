import React from "react";
import "../css/Table.css"

export default function Table({ columns = [], data = [], actions }) {
    return (
        <table className="table">
            <thead className="table-head">
            <tr>
                {columns.map(col => <th key={col.key} className="table-cell">{col.label}</th>)}
                {actions && <th className="table-cell">Actions</th>}
            </tr>
            </thead>
            <tbody className="table-body">
            {data.map(item => (
                <tr key={item.id} className="table-row">
                    {columns.map(col => <td key={col.key} className="table-cell">{item[col.key]}</td>)}
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
