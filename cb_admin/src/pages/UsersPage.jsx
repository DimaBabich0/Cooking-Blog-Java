import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UsersList from "../components/UsersList";
import { getUsers } from "../api/usersApi";

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

    if (loading) return <p>Loading...</p>;

    return (
        <div className="usersPage">
            <h1 className="usersPage-title">List of users:</h1>
            <button className="btn btn-create" onClick={() => navigate("/users/create")}>Create user</button>
            <UsersList users={users} />
        </div>
    );
}
