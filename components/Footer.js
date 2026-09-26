import { Dumbbell } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-[#090a0c]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-7 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <Dumbbell size={17} strokeWidth={3} className="text-[#ccff00]" />
          <span className="text-xs font-black tracking-tight text-white">
            FITLOG
          </span>
        </div>

        <p className="text-center text-[10px] text-zinc-600">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}