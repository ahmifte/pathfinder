import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COURSES } from "@/lib/courses";

export default function CatalogPage() {
  return (
    <section className="container py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Learn to ship AI products that people pay for
        </h1>
        <p className="mt-3 text-muted">
          Practical, no-fluff courses from real production work. Start with a free
          lesson in every course.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {COURSES.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="group flex flex-col rounded-xl border border-default bg-card p-6 transition-colors hover:border-accent"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">
                {course.lessons.length} lessons
              </span>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
                {course.priceLabel}
              </span>
            </div>
            <h2 className="mt-3 text-lg font-semibold">{course.title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted">
              {course.description}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
              View course
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
