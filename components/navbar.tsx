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
  const [loadingUser, setLoadingUser] = useState(true);
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
          setLoadingUser(false);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setLoadingUser(false);
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
    <nav className="sticky top-0 z-20 w-full border-b border-[var(--border)] bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
          Nalin Blog
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {loadingUser ? (
            <span className="rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-500">Loading...</span>
          ) : !user ? (
          <>
            <Link
              href="/signup"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Sign Up
            </Link>
            <Link
              href="/signin"
              className="rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
            >
              Sign In
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/create"
              className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              New Blog
            </Link>
            <button
              onClick={handleSignout}
              className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
            >
              Sign Out
            </button>
          </>
          )}
        </div>
      </div>
    </nav>
  );
}
