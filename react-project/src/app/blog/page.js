"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import "@/app/styles/blogPage.css";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const { data, error } = await supabase.from("blogs").select("*");

    if (error) {
      console.error("Error fetching blogs:", error);
    } else {
      console.log("Blogs fetched:", data);
      setBlogs(data);
    }
  };

  const createBlog = async () => {
    if (!title || !content) return;
    const { error } = await supabase.from("blogs").insert([{ title, content }]);
    if (!error) {
      setTitle("");
      setContent("");
      fetchBlogs();
    }
  };

  const updateBlog = async () => {
    if (!editingId || !title || !content) return;
    const { error } = await supabase.from("blogs").update({ title, content }).eq("id", editingId);
    if (!error) {
      setEditingId(null);
      setTitle("");
      setContent("");
      fetchBlogs();
    }
  };

  const deleteBlog = async (id) => {
    const { error } = await supabase.from("blogs").delete().eq("id", id);
    if (!error) fetchBlogs();
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      console.log("Logged out successfully");
      window.location.href = "/";
    }
  };

  return (
    <div className="container">
      <button onClick={handleLogout} className="logoutButton">Logout</button>

      <h1 className="header">Blog</h1>

      <div className="formContainer">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
        />
        <br />
        <br />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="textarea"
        />
        <br />
        <br />
        <button
            onClick={editingId ? updateBlog : createBlog}
            className="button"
          >
            {editingId ? "Update" : "Create"}
          </button>
      </div>
      <br />
      <br />

      <table className="blogTable">
        <thead>
          <tr>
            <th>Title</th>
            <th>Content</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td>{blog.title}</td>
              <td>{blog.content}</td>
              <td>
                <button
                  onClick={() => {
                    setTitle(blog.title);
                    setContent(blog.content);
                    setEditingId(blog.id);
                  }}
                  className="editButton"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteBlog(blog.id)}
                  className="deleteButton"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
