import React from "react";
import "../css/Form.css"

export default function FormField({ label, value, onChange, type="text", options, placeholder }) {
    return (
        <div className="form-field">
            <label className="form-label">{label}:</label>
            {type === "select" ? (
                <select className="form-input" value={value} onChange={onChange}>
                    <option value="" disabled selected>Select role</option>
                    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
            ) : type === "textarea" ? (
                <textarea className="form-input" value={value} onChange={onChange} placeholder={placeholder} />
            ) : (
                <input type={type} className="form-input" value={value} onChange={onChange} placeholder={placeholder} />
            )}
        </div>
    );
}
