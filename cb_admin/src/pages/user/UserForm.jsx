import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PhotoUploader from "../../components/PhotoUploader.jsx";
import FormField from "../../components/FormField.jsx";
import ActionButtons from "../../components/ActionButtons.jsx";
import { getRoles } from "../../api/userApi.js";
import { UserDto } from "../../models/UserDto.js";
import "../../css/Form.css"

export default function UserForm({ userData = {}, onSave }) {
    const navigate = useNavigate();
    const [user, setUser] = useState({ ...UserDto, ...userData });
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRoles();
    }, []);

    async function loadRoles() {
        const data = await getRoles();
        setRoles(data);
        setLoading(false);
    }

    async function handleSave() {
        await onSave(user);
        navigate("/users");
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div className="form-container">
            <div className="form-card">
                <PhotoUploader
                    folder="user"
                    initialUrl={user.photoUrl}
                    onUpload={url => setUser({ ...user, photoUrl: url })}
                />

                <FormField
                    label="Username"
                    value={user.username}
                    onChange={e => setUser({ ...user, username: e.target.value })}
                />
                <FormField
                    label="First Name"
                    value={user.firstName}
                    onChange={e => setUser({ ...user, firstName: e.target.value })}
                />
                <FormField
                    label="Last Name"
                    value={user.lastName}
                    onChange={e => setUser({ ...user, lastName: e.target.value })}
                />
                <FormField
                    label="Email"
                    type="email"
                    value={user.email}
                    onChange={e => setUser({ ...user, email: e.target.value })}
                />
                <FormField
                    label="Password"
                    type="password"
                    value={user.password}
                    onChange={e => setUser({ ...user, password: e.target.value })}
                />
                <FormField
                    label="Roles"
                    type="select"
                    value={user.role}
                    onChange={e => setUser({ ...user, role: e.target.value })}
                    options={roles.map(r => ({ value: r, label: r }))}
                />

                <ActionButtons
                    onSave={handleSave}
                    onBack={() => navigate("/users")}
                />
            </div>
        </div>
    );
}
