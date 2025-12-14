import React from "react";

export default function ActionButtons({ onView, onEdit, onDelete, onSave, onBack, viewLabel="View", editLabel="Edit", deleteLabel="Delete", saveLabel="Save", backLabel="Back" }) {
    return (
        <div className="view-actions">
            {onView && <button className="btn btn-view" onClick={onView}>{viewLabel}</button>}
            {onEdit && <button className="btn btn-edit" onClick={onEdit}>{editLabel}</button>}
            {onDelete && <button className="btn btn-delete" onClick={onDelete}>{deleteLabel}</button>}
            {onSave && <button className="btn btn-save" onClick={onSave}>{saveLabel}</button>}
            {onBack && <button className="btn btn-back" onClick={onBack}>{backLabel}</button>}
        </div>
    );
}
