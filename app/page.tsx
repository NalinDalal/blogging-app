
"use client";
import { useEffect, useState } from "react";

type Blog = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    email: string;
    name: string | null;
  };
};

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        if (res.ok) {
          setBlogs(data);
        } else {
          setError(data.error || "Failed to fetch blogs.");
        }
      } catch (err) {
        setError("Network error.");
      }
      setLoading(false);
    }
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6">All Blogs</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <ul className="space-y-6">
        {blogs.map(blog => (
          <li key={blog.id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
            <p className="text-zinc-700 mb-2">by {blog.author.name || blog.author.email}</p>
            <p className="text-zinc-500 text-sm mb-2">{new Date(blog.createdAt).toLocaleString()}</p>
            <div className="prose" style={{ whiteSpace: "pre-wrap" }}>{blog.content}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
