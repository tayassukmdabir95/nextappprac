"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  Clock3,
  Flame,
  Star,
  Dumbbell,
} from "lucide-react";

function WorkoutCard({ workout }) {
  return (
    <Link
      href={`/workout/${workout.id}`}
      className="group overflow-hidden rounded-lg border border-zinc-800 bg-[#15171c] transition hover:-translate-y-1 hover:border-zinc-600"
    >
      <div className="relative h-44 overflow-hidden bg-zinc-800">
        <img
          src={workout.image}
          alt={workout.name}
          className="h-full w-full object-cover opacity-80 transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="p-4">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {workout.muscleGroups.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#ccff00] px-2 py-0.5 text-[8px] font-black text-black"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="font-[var(--font-oswald)] text-lg font-bold leading-none text-white">
          {workout.name}
        </h3>

        <p className="mt-2 text-[10px] text-zinc-500">
          {workout.equipment}
        </p>

        <div className="mt-4 flex items-center gap-3 border-t border-zinc-800 pt-3 text-[9px] text-zinc-500">
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
    </Link>
  );
}

export default function Home() {
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getWorkouts() {
      try {
        const response = await fetch("/data.json");

        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }

        const data = await response.json();
        setWorkouts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    getWorkouts();
  }, []);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
        <div className="relative overflow-hidden rounded-xl bg-[#16181e]">
          <div className="grid min-h-[330px] items-center lg:grid-cols-2">
            <div className="relative z-10 p-7 sm:p-10 lg:p-12">
              <p className="mb-3 text-[9px] font-black tracking-widest text-[#ccff00]">
                WORKOUT LIBRARY
              </p>

              <h1 className="max-w-xl font-[var(--font-oswald)] text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl">
                Train with intent. Log every set.
              </h1>

              <p className="mt-5 max-w-lg text-xs leading-5 text-zinc-400">
                FitLog is a dark, no-nonsense gym companion: pick a lift, lock
                it into today's plan, and watch the week's work add up.
              </p>

              <a
                href="#library"
                className="mt-6 inline-flex items-center gap-2 rounded bg-[#ccff00] px-4 py-2.5 text-[9px] font-black text-black transition hover:bg-white"
              >
                <Dumbbell size={13} />
                BROWSE WORKOUTS
              </a>
            </div>

            <div className="relative hidden h-full min-h-[330px] lg:block">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#16181e] via-transparent to-transparent" />
              <img 
                src="/banner.png" 
                className="h-full w-full object-cover opacity-70" 
                alt="Banner"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="library"
        className="mx-auto max-w-6xl scroll-mt-10 px-4 py-10 sm:px-6 sm:py-14"
      >
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-[var(--font-oswald)] text-2xl font-black uppercase">
              The Library
            </h2>

            <p className="mt-1 text-[10px] text-zinc-500">
              Twelve lifts covering every major muscle group.
            </p>
          </div>

          <button className="flex w-fit items-center gap-2 rounded border border-zinc-700 px-3 py-2 text-[9px] font-bold uppercase text-zinc-300">
            Sort By
            <span className="text-[#ccff00]">Duration</span>
            <ArrowDown size={11} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-700 border-t-[#ccff00]" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}