"use client";
import { useState } from "react";
import Link from "next/link";

export default function BlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setIsUnauthorized(false);
    setSubmitting(true);

    try {
      const res = await fetch("/api/blogs/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("Blog posted successfully!");
        setTitle("");
        setContent("");
      } else {
        if (res.status === 401) {
          setIsUnauthorized(true);
        }
        setMessage(data.error || "Error posting blog.");
      }
    } catch {
      setMessage("Error posting blog.");
    } finally {
      setSubmitting(false);
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
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded" disabled={submitting}>
          {submitting ? "Posting..." : "Post Blog"}
        </button>
      </form>
      {message && <p className="mt-4 text-red-600">{message}</p>}
      {isUnauthorized && (
        <div className="mt-8">
          <Link href="/signin" className="text-blue-600 underline">
            Sign in to create a post.
          </Link>
        </div>
      )}
      {content && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Preview</h3>
          <pre className="whitespace-pre-wrap rounded border p-4">{content}</pre>
        </div>
      )}
    </div>
  );
}
