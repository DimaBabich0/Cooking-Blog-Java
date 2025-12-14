import React from "react";
import "../css/Page.css"

export default function Page({ title, actions, children }) {
    return (
        <div className="page">
            <div className="page-header">
                <h1 className="page-title">{title}</h1>
                {actions && <div className="page-actions">{actions}</div>}
            </div>
            <div className="page-content">{children}</div>
        </div>
    );
}
