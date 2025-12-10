import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, deleteUser } from "../../api/usersApi.js";
import { UserDto } from "../../models/UserDto.js";
import "../../css/ViewPage.css"

export default function UserViewPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            setLoading(true);
            const user = await getUser(id);
            console.log(user);
            setUser({...UserDto, ...user});
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!confirm("Delete this user?")) return;
        await deleteUser(id);
        navigate("/users");
    }

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>User not found</p>;

    return (
        <div className="view-container">
            <div className="view-card">

                <div className="view-photo-wrapper">
                    <img
                        src={"http://localhost:8080/api/files/images/" + user.photoUrl}
                        alt="user"
                        className="view-photo"
                    />
                </div>
                <h2>Id: #{id}</h2>

                <div className="view-info">
                    <div className="view-field"><b>Username:</b> {user.username}</div>
                    <div className="view-field"><b>Email:</b> {user.email}</div>
                    <div className="view-field"><b>First name:</b> {user.firstName}</div>
                    <div className="view-field"><b>Last name:</b> {user.lastName}</div>
                    <div className="view-field"><b>Role:</b> {user.role}</div>
                    <div className="view-field"><b>Create date:</b> {user.createdAt}</div>
                </div>

                <div className="view-actions">
                    <button className="btn btn-edit" onClick={() => navigate(`/users/${id}/edit`)}>
                        Edit
                    </button>

                    <button className="btn btn-delete" onClick={handleDelete}>
                        Delete
                    </button>

                    <button className="btn btn-back" onClick={() => navigate("/users")}>
                        Back
                    </button>
                </div>

            </div>
        </div>
    );
}