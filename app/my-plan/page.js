"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Clock3,
  Dumbbell,
  Eye,
  Flame,
  Search,
  Star,
  Trash2,
} from "lucide-react";

export default function MyPlanPage() {
  const [plan, setPlan] = useState([]);
  const [saved, setSaved] = useState([]);
  const [activeTab, setActiveTab] = useState("plan");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("duration");
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const storedPlan = JSON.parse(localStorage.getItem("fitlog-plan") || "[]");
    const storedSaved = JSON.parse(
      localStorage.getItem("fitlog-saved") || "[]"
    );

    setPlan(storedPlan);
    setSaved(storedSaved);
    setIsLoading(false);
  }, []);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  }

  function updatePlan(updatedPlan) {
    setPlan(updatedPlan);
    localStorage.setItem("fitlog-plan", JSON.stringify(updatedPlan));
    window.dispatchEvent(new Event("fitlog-updated"));
  }

  function updateSaved(updatedSaved) {
    setSaved(updatedSaved);
    localStorage.setItem("fitlog-saved", JSON.stringify(updatedSaved));
    window.dispatchEvent(new Event("fitlog-updated"));
  }

  function removeWorkout(id) {
    if (activeTab === "plan") {
      updatePlan(plan.filter((workout) => workout.id !== id));
      showToast("Removed from today's plan");
      return;
    }

    updateSaved(saved.filter((workout) => workout.id !== id));
    showToast("Removed from saved workouts");
  }

  function markAsDone(id) {
    const updatedPlan = plan.map((workout) =>
      workout.id === id ? { ...workout, done: true } : workout
    );

    updatePlan(updatedPlan);
    showToast("Workout marked as done");
  }

  const exercises = plan.length;
  const totalMinutes = plan.reduce(
    (total, workout) => total + workout.duration,
    0
  );
  const totalCalories = plan.reduce(
    (total, workout) => total + workout.caloriesBurned,
    0
  );

  const visibleWorkouts = useMemo(() => {
    const workouts = activeTab === "plan" ? plan : saved;
    const searchText = search.toLowerCase().trim();

    const filteredWorkouts = workouts.filter((workout) => {
      const nameMatches = workout.name.toLowerCase().includes(searchText);
      const tagMatches = workout.muscleGroups.some((group) =>
        group.toLowerCase().includes(searchText)
      );

      return nameMatches || tagMatches;
    });

    return [...filteredWorkouts].sort((a, b) => {
      if (sortBy === "calories") {
        return b.caloriesBurned - a.caloriesBurned;
      }

      if (sortBy === "rating") {
        return b.rating - a.rating;
      }

      return b.duration - a.duration;
    });
  }, [activeTab, plan, saved, search, sortBy]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {toast && (
        <div className="fixed right-4 top-20 z-50 rounded border border-[#ccff00] bg-[#16181e] px-4 py-3 text-xs font-bold text-white shadow-xl">
          {toast}
        </div>
      )}

      <h1 className="font-[var(--font-oswald)] text-4xl font-black uppercase sm:text-5xl">
        My Plan
      </h1>

      <p className="mt-2 text-xs text-zinc-500">
        Cap of five lifts for today. Finish them, then load more.
      </p>

      <div className="mt-8 grid grid-cols-3 overflow-hidden rounded-lg border border-zinc-800">
        <div className="bg-[#15171c] px-4 py-4 sm:px-6">
          <p className="text-[9px] font-bold uppercase text-zinc-500">
            Exercises
          </p>

          <p className="mt-1 font-[var(--font-oswald)] text-3xl font-black text-[#ccff00]">
            {exercises}
          </p>
        </div>

        <div className="border-x border-zinc-800 bg-[#15171c] px-4 py-4 sm:px-6">
          <p className="text-[9px] font-bold uppercase text-zinc-500">
            Minutes
          </p>

          <p className="mt-1 font-[var(--font-oswald)] text-3xl font-black">
            {totalMinutes}
          </p>
        </div>

        <div className="bg-[#15171c] px-4 py-4 sm:px-6">
          <p className="text-[9px] font-bold uppercase text-zinc-500">
            Calories
          </p>

          <p className="mt-1 font-[var(--font-oswald)] text-3xl font-black">
            {totalCalories}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-zinc-800 bg-[#101216]">
        <div className="flex flex-col gap-4 border-b border-zinc-800 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-fit rounded bg-[#181b21] p-1">
            <button
              onClick={() => setActiveTab("plan")}
              className={`rounded px-4 py-2 text-[10px] font-black uppercase transition ${
                activeTab === "plan"
                  ? "bg-[#ccff00] text-black"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              Today&apos;s Plan
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={`rounded px-4 py-2 text-[10px] font-black uppercase transition ${
                activeTab === "saved"
                  ? "bg-[#ccff00] text-black"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              Saved
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex items-center gap-2 rounded border border-zinc-700 px-3 py-2">
              <Search size={13} className="text-zinc-500" />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search workouts"
                className="w-full bg-transparent text-xs text-white outline-none placeholder:text-zinc-600 sm:w-36"
              />
            </label>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded border border-zinc-700 bg-[#101216] px-3 py-2 text-xs text-zinc-300 outline-none"
            >
              <option value="duration">Duration</option>
              <option value="calories">Calories</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center text-sm text-zinc-400">
            Loading workouts…
          </div>
        ) : visibleWorkouts.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-4 text-center">
            <Dumbbell size={26} className="text-[#ccff00]" />

            <h2 className="mt-4 font-[var(--font-oswald)] text-2xl font-black uppercase">
              Nothing here yet
            </h2>

            <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-500">
              Browse the library and add a lift to get today moving.
            </p>

            <Link
              href="/"
              className="mt-5 rounded bg-[#ccff00] px-4 py-2.5 text-xs font-black text-black transition hover:bg-white"
            >
              Go to workouts
            </Link>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {visibleWorkouts.map((workout) => (
              <article
                key={workout.id}
                className="flex flex-col gap-4 rounded-lg border border-zinc-800 bg-[#16181e] p-3 sm:flex-row sm:items-center"
              >
                <img
                  src={workout.image}
                  alt={workout.name}
                  className="h-20 w-full rounded object-cover sm:w-28"
                />

                <div className="min-w-0 flex-1">
                  <h2
                    className={`font-[var(--font-oswald)] text-xl font-black uppercase ${
                      workout.done ? "text-zinc-500 line-through" : "text-white"
                    }`}
                  >
                    {workout.name}
                  </h2>

                  <p className="mt-1 text-[10px] text-zinc-500">
                    {workout.equipment}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Clock3 size={11} />
                      {workout.duration} min
                    </span>

                    <span className="flex items-center gap-1">
                      <Flame size={11} />
                      {workout.caloriesBurned} kcal
                    </span>

                    <span className="flex items-center gap-1">
                      <Star size={11} />
                      {workout.rating}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:justify-end">
                  <Link
                    href={`/workout/${workout.id}`}
                    className="inline-flex items-center gap-1.5 rounded border border-zinc-700 px-3 py-2 text-[10px] font-bold text-zinc-300 transition hover:border-[#ccff00] hover:text-[#ccff00]"
                  >
                    <Eye size={12} />
                    View Details
                  </Link>

                  {activeTab === "plan" && (
                    <button
                      onClick={() => markAsDone(workout.id)}
                      disabled={workout.done}
                      className="inline-flex items-center gap-1.5 rounded bg-[#ccff00] px-3 py-2 text-[10px] font-black text-black disabled:bg-zinc-700 disabled:text-zinc-400"
                    >
                      <Check size={12} />
                      {workout.done ? "Done" : "Mark as Done"}
                    </button>
                  )}

                  <button
                    onClick={() => removeWorkout(workout.id)}
                    className="inline-flex items-center justify-center rounded border border-zinc-700 p-2 text-zinc-400 transition hover:border-red-400 hover:text-red-400"
                    aria-label={`Remove ${workout.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}