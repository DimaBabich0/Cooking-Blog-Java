import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserForm from "./UserForm.jsx";
import { getUser, updateUser } from "../../api/userApi.js";
import { UserDto } from "../../models/UserDto.js";

export default function UserEditPage() {
    const { id } = useParams();
    const [userData, setUserData] = useState({ ...UserDto });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getUser(id);
            setUserData(data);
            setLoading(false);
        }
        load();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!userData) return <p>User not found</p>;

    return <UserForm userData={userData} onSave={data => updateUser(id, data)} />;
}
