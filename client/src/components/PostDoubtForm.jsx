import React, { useState } from "react";
import api from "../api";

export default function PostDoubtForm({ onDoubtPosted }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    attachment: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in form) formData.append(key, form[key]);

    await api.post("/doubts", formData);
    onDoubtPosted();
    setForm({ title: "", description: "", tags: "", attachment: null });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 bg-white shadow rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Post a New Doubt</h2>
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-2"
        required
      />
      <textarea
        name="description"
        placeholder="Describe your doubt..."
        value={form.description}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-2"
        required
      />
      <input
        name="tags"
        placeholder="Tags (comma-separated)"
        value={form.tags}
        onChange={handleChange}
        className="w-full border p-2 rounded mb-2"
      />
      <input
        type="file"
        name="attachment"
        onChange={handleChange}
        className="w-full mb-2"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Post Doubt</button>
    </form>
  );
}
