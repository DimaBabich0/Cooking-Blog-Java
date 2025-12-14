import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../../components/Page.jsx";
import Table from "../../components/Table.jsx";
import { getUsers, deleteUser } from "../../api/userApi.js";

export default function UsersPage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    async function load() {
        const data = await getUsers();
        setUsers(data);
        setLoading(false);
    }

    async function handleDelete(user) {
        if (!confirm(`Delete user "${user.username}"?`)) return;
        await deleteUser(user.id);
        setUsers(users.filter(b => b.id !== user.id));
    }

    if (loading) return <p>Loading...</p>;

    return (
        <Page
            title="List of Users"
            actions={<button className="btn btn-create" onClick={() => navigate("/users/create")}>Create User</button>}
        >
            <Table
                columns={[
                    { key: "id", label: "ID" },
                    { key: "username", label: "Username" },
                    { key: "email", label: "Email" },
                    { key: "role", label: "Role" },
                ]}
                data={users}
                actions={[
                    { label: "View", type: "view", onClick: b => navigate(`/users/${b.id}`) },
                    { label: "Edit", type: "edit", onClick: b => navigate(`/users/${b.id}/edit`) },
                    { label: "Delete", type: "delete", onClick: handleDelete },
                ]}
            />
        </Page>
    );
}
