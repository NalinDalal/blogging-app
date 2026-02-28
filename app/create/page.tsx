"use client";
import { useState } from "react";

export default function BlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [markdownPreview, setMarkdownPreview] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    // Replace with actual user id from auth context/session
    const userId = localStorage.getItem("userId") || "";
    if (!userId) {
      setMessage("You must be signed in to post a blog.");
      return;
    }
    const res = await fetch("/api/blogs/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: userId,
      },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Blog posted successfully!");
      setMarkdownPreview(data.htmlContent);
      setTitle("");
      setContent("");
    } else {
      setMessage(data.error || "Error posting blog.");
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Create a Blog Post</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <textarea
          placeholder="Content (Markdown)"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="border p-2 rounded h-40"
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Post Blog</button>
      </form>
      {message && <p className="mt-4 text-red-600">{message}</p>}
      {markdownPreview && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Preview</h3>
          <div dangerouslySetInnerHTML={{ __html: markdownPreview }} />
        </div>
      )}
    </div>
  );
}
