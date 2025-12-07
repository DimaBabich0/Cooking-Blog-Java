import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../../api/blogApi.js";
import { getUsers } from "../../api/usersApi.js";

export default function BlogCreatePage() {
    const navigate = useNavigate();
    const [blog, setBlog] = useState({
        title: "",
        userId: "",
        text: "",
        description: "",
        cookingTime: 0
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUsers() {
            const data = await getUsers();
            setUsers(data);
            setLoading(false);
        }
        loadUsers();
    }, []);

    async function handleSave() {
        await createBlog(blog);
        navigate("/blogs");
    }

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2>Create Blog</h2>
            <input placeholder="Title" value={blog.title} onChange={e => setBlog({...blog, title: e.target.value})} />
            <textarea placeholder="Text" value={blog.text} onChange={e => setBlog({...blog, text: e.target.value})} />
            <input placeholder="Description" value={blog.description} onChange={e => setBlog({...blog, description: e.target.value})} />
            <input type="number" placeholder="Cooking Time" value={blog.cookingTime} onChange={e => setBlog({...blog, cookingTime: parseInt(e.target.value)})} />
            <select value={blog.userId} onChange={e => setBlog({...blog, userId: parseInt(e.target.value)})}>
                <option value="">Select user</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
            </select>
            <button onClick={handleSave}>Create</button>
            <button onClick={() => navigate("/blogs")}>Back</button>
        </div>
    );
}
