"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { LayoutDashboard, MessageCircle, Dumbbell, Library, History, Settings, LogOut, Sun, Moon } from "lucide-react";
import { useUser } from "../../context/UserContext";
import { useTheme } from "../../context/ThemeContext";
import { apiRequest } from "../../lib/apiRequest";
import type { LucideIcon } from "lucide-react";

type NavLink = {
  href: string;
  label: string;
  Icon: LucideIcon;
};

const NAV_LINKS: NavLink[] = [
  { href: "/dashboard",  label: "Dashboard",  Icon: LayoutDashboard },
  { href: "/chat",   label: "Chat",       Icon: MessageCircle },
  { href: "/chats",  label: "History",    Icon: History },
  { href: "/flashcards", label: "Flashcards", Icon: Dumbbell },
  { href: "/vocabulary", label: "Vocabulary", Icon: Library },
];

// Pages where the header should not be shown
const HIDDEN_PATHS = ["/", "/login", "/signup", "/pricing", "/how-it-works", "/help-center", "/privacy-policy", "/terms-of-service"];

export const Header = () => {
  const router = useRouter();
  const { username, subscriptionPlan } = useUser();
  const { theme, toggleTheme } = useTheme();

  if (HIDDEN_PATHS.includes(router.pathname)) return null;

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2">
        {/* Left: logo + nav */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 shrink-0"
          >
            <Image
              src="/img/logo.png"
              alt="Kaiwa Kun"
              width={24}
              height={24}
              className="object-contain rounded-sm"
            />
          </Link>

          <nav className="flex items-center gap-0.5">
            {NAV_LINKS.map(({ href, label, Icon }) => {
              const active = router.pathname === href || router.pathname.startsWith(href + "/");
              const base = `flex items-center gap-1.5 rounded-md transition-colors ${
                active
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`;
              return (
                <Link key={href} href={href} className={`${base} px-3 py-1.5 text-sm`}>
                  <Icon size={14} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: theme toggle + user avatar */}
        <div className="flex items-center gap-0.5 shrink-0">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          >
            {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
          </button>
          <UserAccountMenu username={username} subscriptionPlan={subscriptionPlan} />
        </div>
      </div>
    </header>
  );
};

function UserAccountMenu({
  username,
  subscriptionPlan,
}: {
  username: string;
  subscriptionPlan: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleLogout = async () => {
    await apiRequest("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const initials = username
    ? username.charAt(0).toUpperCase()
    : "?";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
        style={{ background: subscriptionPlan === "pro" ? "#111" : "#9ca3af" }}
      >
        {initials}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+6px)] z-[100] min-w-[10rem] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-1 shadow-lg"
        >
          <Link
            href="/settings"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <Settings size={14} className="opacity-60" />
            Settings
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <LogOut size={14} className="opacity-60" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;
