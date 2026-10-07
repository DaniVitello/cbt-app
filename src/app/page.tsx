"use client";

import { useState } from "react";
import Link from "next/link";
import { exercises } from "@/data/exercises";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Ensure exercises are plain objects for Client Component serialization
const plainExercises: typeof exercises = JSON.parse(JSON.stringify(exercises));

const categories = [
  {
    id: "thoughts",
    name: "Pensamientos y creencias",
    description: "Identificar, cuestionar y reestructurar pensamientos y creencias",
    exercises: [
      "cognitive-restructuring",
      "thought-record",
      "dysfunctional-thought-record",
      "disputing-irrational-beliefs",
      "core-beliefs-suitcases",
      "downward-arrow",
      "cataloging-inner-rules",
    ],
  },
  {
    id: "anxiety",
    name: "Ansiedad y preocupación",
    description: "Manejar la ansiedad, el catastrofismo y la preocupación",
    exercises: [
      "decatastrophizing",
      "rabbit-hole",
      "challenging-catastrophic",
    ],
  },
  {
    id: "action",
    name: "Acción y resolución",
    description: "Resolución de problemas y cambio de conducta",
    exercises: [
      "problem-solving",
      "behavioral-experiments",
      "wdep-questions",
    ],
  },
  {
    id: "selfcare",
    name: "Cuidado personal y relajación",
    description: "Fortalecer recursos internos y relajación",
    exercises: ["i-will-survive", "pmr"],
  },
];

export default function Home() {
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-10 border-b bg-card">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-semibold">
              CBT App
            </Link>
            <button
              onClick={() => setDark(!dark)}
              className="rounded-md p-2 hover:bg-accent"
              aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
            >
              {dark ? "☀️" : "🌙"}
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-8">
          <h1 className="mb-2 text-3xl font-bold">Ejercicios</h1>
          <p className="mb-8 text-muted-foreground">
            Elegí un ejercicio para comenzar. Podés volver a tus respuestas cuando quieras.
          </p>

          {categories.map((category) => (
            <section key={category.id} className="mb-10">
              <h2 className="mb-1 text-xl font-semibold">{category.name}</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                {category.description}
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.exercises.map((exerciseId) => {
                  const exercise = plainExercises.find((e) => e.id === exerciseId);
                  if (!exercise) return null;
                  return (
                    <Link key={exercise.id} href={`/exercises/${exercise.id}`}>
                      <Card className="h-full transition-colors hover:border-primary">
                        <CardHeader>
                          <CardTitle className="text-base">{exercise.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {exercise.description}
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
}
