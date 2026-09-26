"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Bookmark,
  CalendarPlus,
  Check,
  Clock3,
  Flame,
  Star,
} from "lucide-react";

export default function WorkoutDetailsPage() {
  const params = useParams();
  const [workout, setWorkout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    async function getWorkout() {
      try {
        const response = await fetch("/data.json");
        const data = await response.json();
        const selectedWorkout = data.find(
          (item) => String(item.id) === String(params.id)
        );

        setWorkout(selectedWorkout);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    getWorkout();
  }, [params.id]);

  function showToast(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  }

  function addToPlan() {
    const savedPlan = JSON.parse(localStorage.getItem("fitlog-plan") || "[]");

    if (savedPlan.some((item) => item.id === workout.id)) {
      showToast("Workout is already in today's plan");
      return;
    }

    if (savedPlan.length >= 5) {
      showToast("Today's plan can only contain five lifts");
      return;
    }

    localStorage.setItem(
      "fitlog-plan",
      JSON.stringify([...savedPlan, workout])
    );

    showToast("Added to today's plan");
  }

  function saveForLater() {
    const savedWorkouts = JSON.parse(
      localStorage.getItem("fitlog-saved") || "[]"
    );

    if (savedWorkouts.some((item) => item.id === workout.id)) {
      showToast("Workout is already saved");
      return;
    }

    localStorage.setItem(
      "fitlog-saved",
      JSON.stringify([...savedWorkouts, workout])
    );

    showToast("Saved for later");
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-[#ccff00]" />
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center px-4 text-center">
        <h1 className="font-[var(--font-oswald)] text-4xl font-black uppercase">
          Workout not found
        </h1>

        <Link
          href="/"
          className="mt-5 rounded bg-[#ccff00] px-4 py-2 text-xs font-black text-black"
        >
          Back to workouts
        </Link>
      </div>
    );
  }

  const plan = JSON.parse(localStorage.getItem("fitlog-plan") || "[]");
  const isPlanFull = plan.length >= 5;
  const isInPlan = plan.some((item) => item.id === workout.id);

  const specs = [
    ["Equipment", workout.equipment],
    ["Difficulty", workout.difficulty],
    ["Sets", workout.sets],
    ["Reps", workout.reps],
    ["Duration", `${workout.duration} min`],
    ["Calories", `${workout.caloriesBurned} kcal`],
    ["Rating", workout.rating],
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {toast && (
        <div className="fixed right-4 top-20 z-50 rounded border border-[#ccff00] bg-[#16181e] px-4 py-3 text-xs font-bold text-white shadow-xl">
          {toast}
        </div>
      )}

      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-xs font-bold text-zinc-400 transition hover:text-[#ccff00]"
      >
        <ArrowLeft size={15} />
        BACK TO LIBRARY
      </Link>

      <section className="rounded-xl border border-zinc-800 bg-[#101216] p-4 sm:p-6 lg:p-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <div className="overflow-hidden rounded-lg bg-zinc-800">
            <img
              src={workout.image}
              alt={workout.name}
              className="h-full min-h-80 w-full object-cover lg:min-h-[560px]"
            />
          </div>

          <div>
            <h1 className="font-[var(--font-oswald)] text-4xl font-black uppercase leading-none text-white sm:text-5xl">
              {workout.name}
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400">
              {workout.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {workout.muscleGroups.map((group) => (
                <span
                  key={group}
                  className="rounded-full bg-[#ccff00] px-3 py-1 text-[10px] font-black uppercase text-black"
                >
                  {group}
                </span>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-lg border border-zinc-800">
              {specs.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-zinc-800 bg-[#171a20] px-4 py-3 last:border-b-0"
                >
                  <span className="text-[9px] font-black uppercase tracking-wider text-zinc-500">
                    {label}
                  </span>

                  <span className="text-xs font-medium text-zinc-200">
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="font-[var(--font-oswald)] text-xl font-black uppercase">
                Instructions
              </h2>

              <ol className="mt-4 space-y-3">
                {workout.instructions.map((instruction, index) => (
                  <li
                    key={instruction}
                    className="flex gap-3 text-xs leading-5 text-zinc-400"
                  >
                    <span className="font-bold text-[#ccff00]">
                      {index + 1}.
                    </span>
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={addToPlan}
                disabled={isPlanFull || isInPlan}
                className="inline-flex items-center justify-center gap-2 rounded bg-[#ccff00] px-4 py-3 text-xs font-black text-black transition hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
              >
                <CalendarPlus size={15} />
                {isInPlan ? "Added to today's plan" : "Add to today's plan"}
              </button>

              <button
                onClick={saveForLater}
                className="inline-flex items-center justify-center gap-2 rounded border border-zinc-700 px-4 py-3 text-xs font-bold text-zinc-200 transition hover:border-[#ccff00] hover:text-[#ccff00]"
              >
                <Bookmark size={15} />
                Save for later
              </button>
            </div>

            <div className="mt-7 flex flex-wrap gap-4 border-t border-zinc-800 pt-5 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Clock3 size={14} />
                {workout.duration} min
              </span>

              <span className="flex items-center gap-1.5">
                <Flame size={14} />
                {workout.caloriesBurned} kcal
              </span>

              <span className="flex items-center gap-1.5">
                <Star size={14} />
                {workout.rating}
              </span>

              <span className="flex items-center gap-1.5 text-[#ccff00]">
                <Check size={14} />
                {workout.sets} sets
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}