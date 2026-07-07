import { createFileRoute, notFound } from "@tanstack/react-router";
import { LessonLayout } from "@/components/lesson/LessonLayout";
import { SORTING_LESSONS } from "@/lib/dsa/content/sorting";

export const Route = createFileRoute("/sorting/$algo")({
  loader: ({ params }) => {
    const lesson = SORTING_LESSONS[params.algo];
    if (!lesson) throw notFound();
    return { lesson };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.lesson.name} — TechKnots` },
          { name: "description", content: loaderData.lesson.tagline },
          { property: "og:title", content: `${loaderData.lesson.name} — TechKnots` },
          { property: "og:description", content: loaderData.lesson.tagline },
        ]
      : [{ title: "Sorting — TechKnots" }],
  }),
  component: SortingLesson,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl p-12 text-center">
      <h1 className="font-display text-3xl font-bold">Algorithm not found</h1>
      <p className="mt-2 text-muted-foreground">Pick one from the sorting hub.</p>
    </div>
  ),
});

function SortingLesson() {
  const { lesson } = Route.useLoaderData();
  return <LessonLayout content={lesson} />;
}
