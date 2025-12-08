import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsersTable from "../../components/tables/UsersTable.jsx";
import { getUsers } from "../../api/usersApi.js";
import "../../css/Page.css"

export default function UsersPage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => { load() }, []);

    async function load() {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (e) {
            setError("Error while trying get User table:" + e);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <h1 className="page-title">{error}</h1>;

    return (
        <div className="page">
            <h1 className="page-title">List of users:</h1>
            <button className="btn btn-create" onClick={() => navigate("/users/create")}>Create user</button>
            <UsersTable users={users} />
        </div>
    );
}
