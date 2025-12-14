import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ViewCard from "../../components/ViewCard.jsx";
import { getUser, deleteUser } from "../../api/userApi.js";
import { format } from "date-fns";
import {UserDto} from "../../models/UserDto.js";

export default function UserViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({ ...UserDto });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        const user = await getUser(id);
        setUser({...UserDto, ...user});
        setLoading(false);
    }

    async function handleDelete() {
        if (!confirm("Delete this user?")) return;
        await deleteUser(id);
        navigate("/users");
    }

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>User not found</p>;

    const fields = [
        { label: "Username", value: user.username },
        { label: "Email", value: user.email },
        { label: "First name", value: user.firstName },
        { label: "Last name", value: user.lastName },
        { label: "Role", value: user.role },
        { label: "Create date", value: format(new Date(user.createdAt), "HH:mm:ss, d MMMM yyyy") },
    ];

    return (
        <ViewCard
            photoUrl={user.photoUrl && `http://localhost:8080/api/files/images/${user.photoUrl}`}
            title={`Id: #${id}`}
            fields={fields}
            actions={{
                onEdit: () => navigate(`/users/${id}/edit`),
                onDelete: handleDelete,
                onBack: () => navigate("/users")
            }}
        />
    );
}
