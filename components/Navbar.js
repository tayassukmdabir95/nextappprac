"use client";

import Link from "next/link";
import { Dumbbell, Bookmark, ClipboardList } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-zinc-800 bg-[#090a0c]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Dumbbell size={18} strokeWidth={3} className="text-[#ccff00]" />
          <span className="text-sm font-black tracking-tight text-white">
            FITLOG
          </span>
        </Link>

        <div className="hidden items-center gap-2 sm:flex">
          <Link
            href="/"
            className={`rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wide ${
              pathname === "/"
                ? "bg-[#ccff00] text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Workout
          </Link>

          <Link
            href="/my-plan"
            className={`rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-wide ${
              pathname === "/my-plan"
                ? "bg-[#ccff00] text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            My Plan
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/my-plan"
            className="flex items-center gap-1.5 rounded-full bg-[#ccff00] px-3 py-1.5 text-[10px] font-bold text-black"
          >
            <ClipboardList size={11} />
            <span className="hidden xs:inline">Plan</span>
            <span>0</span>
          </Link>

          <Link
            href="/my-plan"
            className="flex items-center gap-1.5 rounded-full border border-zinc-700 px-3 py-1.5 text-[10px] font-bold text-zinc-300"
          >
            <Bookmark size={11} />
            <span className="hidden xs:inline">Saved</span>
            <span>0</span>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 border-t border-zinc-800 py-2 sm:hidden">
        <Link
          href="/"
          className={`rounded-full px-5 py-1 text-[10px] font-bold uppercase ${
            pathname === "/"
              ? "bg-[#ccff00] text-black"
              : "text-zinc-400"
          }`}
        >
          Workout
        </Link>

        <Link
          href="/my-plan"
          className={`rounded-full px-5 py-1 text-[10px] font-bold uppercase ${
            pathname === "/my-plan"
              ? "bg-[#ccff00] text-black"
              : "text-zinc-400"
          }`}
        >
          My Plan
        </Link>
      </div>
    </nav>
  );
}