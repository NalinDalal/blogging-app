'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type SessionUser = {
  id: string;
  email: string;
  name: string | null;
};

export default function Navbar() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();

        if (!cancelled) {
          setUser(data.user ?? null);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      }
    }

    void loadUser();

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  async function handleSignout() {
    await fetch("/api/auth/signout", {
      method: "POST",
    });
    setUser(null);
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="w-full bg-zinc-100 dark:bg-zinc-900 py-4 px-8 flex justify-between items-center mb-8 shadow">
      <Link href="/" className="text-xl font-bold text-blue-700 dark:text-blue-300">Blogging App</Link>
      <div className="flex gap-4">
        {!user ? (
          <>
            <Link href="/signup" className="px-4 py-2 rounded bg-blue-600 text-white">Sign Up</Link>
            <Link href="/signin" className="px-4 py-2 rounded bg-green-600 text-white">Sign In</Link>
          </>
        ) : (
          <>
            <Link href="/create" className="px-4 py-2 rounded bg-purple-600 text-white">New Blog</Link>
            <button onClick={handleSignout} className="px-4 py-2 rounded bg-red-600 text-white">Sign Out</button>
          </>
        )}
      </div>
    </nav>
  );
}
