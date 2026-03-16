
"use client";
import { useEffect, useState } from "react";

type Blog = {
  id: number;
  title: string;
  content: string | null;
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
        const res = await fetch("/api/blogs", { cache: "no-store" });
        const data = await res.json();
        if (res.ok) {
          setBlogs(data);
        } else {
          setError(data.error || "Failed to fetch blogs.");
        }
      } catch {
        setError("Network error.");
      }
      setLoading(false);
    }
    fetchBlogs();
  }, []);

  return (
    <div className="py-8 sm:py-10">
      <div className="mb-7 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Latest Posts</h2>
        <p className="mt-2 text-sm text-slate-600">Recent writing from the community.</p>
      </div>
      {loading && (
        <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">Loading blogs...</p>
      )}
      {error && <p className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
      {!loading && !error && blogs.length === 0 && (
        <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600">
          No blog posts yet. Be the first to write one.
        </p>
      )}
      <ul className="space-y-5">
        {blogs.map(blog => (
          <li
            key={blog.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition hover:shadow-md"
          >
            <h3 className="mb-2 text-xl font-semibold tracking-tight text-slate-900">{blog.title}</h3>
            <p className="mb-1 text-sm text-slate-700">by {blog.author.name || blog.author.email}</p>
            <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">
              {new Date(blog.createdAt).toLocaleString()}
            </p>
            <div className="text-sm leading-6 text-slate-700" style={{ whiteSpace: "pre-wrap" }}>
              {blog.content ?? ""}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
