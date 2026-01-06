import React, {useState, useRef} from "react";
import AsyncSelect from "react-select/async";
import debounce from "lodash.debounce";
import { searchUsers } from "../api/userApi.js";

export default function UserSelect({ label, value, onChange, placeholder = "Select user..." }) {
    const [selectedUser, setSelectedUser] = useState(value || null);

    const formatUsers = (users) =>
        users.map(u => ({
            value: u.id,
            label: (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                        src={`http://localhost:8080/api/files/images/${u.photoUrl}`}
                        style={{ width: 24, height: 24, borderRadius: "50%", marginRight: 8, objectFit: "cover" }}
                    />
                    {u.username}
                </div>
            )
        }));

    const debouncedLoadRef = useRef(
        debounce((inputValue, callback) => {
            searchUsers(inputValue)
                .then(users => callback(formatUsers(users)))
                .catch(() => callback([]));
        }, 500)
    );

    const loadOptions = (inputValue) => {
        return new Promise((resolve) => {
            debouncedLoadRef.current(inputValue, resolve);
        });
    };

    const handleChange = (option) => {
        setSelectedUser(option);
        if (onChange) onChange(option ? option.value : null);
    };

    return (
        <div className="form-field">
            <label className="form-label">{label}:</label>
            <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadOptions}
                value={selectedUser}
                onChange={handleChange}
                placeholder={placeholder}
                isClearable
                styles={{
                    option: (provided) => ({
                        ...provided,
                        display: 'flex',
                        alignItems: 'center'
                    }),
                    singleValue: (provided) => ({
                        ...provided,
                        display: 'flex',
                        alignItems: 'center'
                    })
                }}
            />
        </div>
    );
}