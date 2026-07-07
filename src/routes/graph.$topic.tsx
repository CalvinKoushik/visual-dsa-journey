import { createFileRoute, notFound } from "@tanstack/react-router";
import { LessonLayout } from "@/components/lesson/LessonLayout";
import { GRAPH_LESSONS } from "@/lib/dsa/content/graph";

export const Route = createFileRoute("/graph/$topic")({
  loader: ({ params }) => {
    const lesson = GRAPH_LESSONS[params.topic];
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
      : [{ title: "Graphs — TechKnots" }],
  }),
  component: () => <LessonLayout content={Route.useLoaderData().lesson} />,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl p-12 text-center">
      <h1 className="font-display text-3xl font-bold">Topic not found</h1>
    </div>
  ),
});
