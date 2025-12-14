import React from "react";
import ActionButtons from "./ActionButtons.jsx";
import "../css/ViewCard.css"

export default function ViewCard({ photoUrl, title, fields = [], actions }) {
    return (
        <div className="view-container">
            <div className="view-card">
                {photoUrl && (
                    <div className="view-photo-wrapper">
                        <img src={photoUrl} alt="preview" className="view-photo" />
                    </div>
                )}
                <h2>{title}</h2>
                <div className="view-info">
                    {fields.map(f => (
                        <div className="view-field" key={f.label}>
                            <b>{f.label}:</b> {f.value}
                        </div>
                    ))}
                </div>
                {actions && <ActionButtons {...actions} />}
            </div>
        </div>
    );
}
