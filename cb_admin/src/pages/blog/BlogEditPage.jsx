import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBlog, updateBlog } from "../../api/blogApi.js";
import { getUsers } from "../../api/usersApi.js";

export default function BlogEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const data = await getBlog(id);
            const usersData = await getUsers();
            setBlog(data);
            setUsers(usersData);
            setLoading(false);
        }
        load();
    }, []);

    async function save() {
        await updateBlog(id, blog);
        navigate(`/blogs/${id}`);
    }

    if (loading) return <p>Loading...</p>;
    if (!blog) return <p>Blog not found</p>;

    return (
        <div>
            <h2>Edit Blog</h2>
            <input placeholder="Name" value={blog.name} onChange={e => setBlog({...blog, name: e.target.value})} />
            <textarea placeholder="Text" value={blog.text} onChange={e => setBlog({...blog, text: e.target.value})} />
            <input placeholder="Description" value={blog.description} onChange={e => setBlog({...blog, description: e.target.value})} />
            <input type="number" placeholder="Cooking Time" value={blog.cookingTime} onChange={e => setBlog({...blog, cookingTime: parseInt(e.target.value)})} />
            <select value={blog.userId} onChange={e => setBlog({...blog, userId: parseInt(e.target.value)})}>
                <option value="">Select user</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
            </select>
            <button onClick={save}>Save</button>
            <button onClick={() => navigate("/blogs")}>Back</button>
        </div>
    );
}
