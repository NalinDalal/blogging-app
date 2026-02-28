'use client';
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setUserId(typeof window !== "undefined" ? localStorage.getItem("userId") : null);
  }, []);

  function handleSignout() {
    localStorage.removeItem("userId");
    setUserId(null);
    window.location.href = "/";
  }

  return (
    <nav className="w-full bg-zinc-100 dark:bg-zinc-900 py-4 px-8 flex justify-between items-center mb-8 shadow">
      <Link href="/" className="text-xl font-bold text-blue-700 dark:text-blue-300">Blogging App</Link>
      <div className="flex gap-4">
        {!userId ? (
          <>
            <Link href="/signup" className="px-4 py-2 rounded bg-blue-600 text-white">Sign Up</Link>
            <Link href="/signin" className="px-4 py-2 rounded bg-green-600 text-white">Sign In</Link>
          </>
        ) : (
          <>
            <Link href="/blog" className="px-4 py-2 rounded bg-purple-600 text-white">New Blog</Link>
            <button onClick={handleSignout} className="px-4 py-2 rounded bg-red-600 text-white">Sign Out</button>
          </>
        )}
      </div>
    </nav>
  );
}