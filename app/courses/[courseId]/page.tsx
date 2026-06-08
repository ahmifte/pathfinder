import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { CheckCircle2, Circle, Lock, PlayCircle } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getCourse } from "@/lib/courses";
import { getCompletedLessons, hasPurchased } from "@/lib/access";
import { BuyButton } from "@/components/buy-button";

// Ownership and progress depend on the signed-in user, so this page must render
// per request rather than be statically cached.
export const dynamic = "force-dynamic";

export function generateMetadata({
  params,
}: {
  params: { courseId: string };
}): Metadata {
  const course = getCourse(params.courseId);
  if (!course) return {};
  return { title: course.title, description: course.description };
}

export default async function CoursePage({
  params,
}: {
  params: { courseId: string };
}) {
  const course = getCourse(params.courseId);
  if (!course) notFound();

  const session = await getServerSession(authOptions);
  const owned = session?.user?.id
    ? await hasPurchased(session.user.id, course.id)
    : false;
  const completed = session?.user?.id
    ? await getCompletedLessons(session.user.id, course.id)
    : new Set<string>();

  return (
    <section className="container py-12">
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
          <p className="mt-3 text-muted">{course.description}</p>

          <h2 className="mt-10 text-lg font-semibold">Curriculum</h2>
          <ul className="mt-4 divide-y divide-[hsl(var(--border))] rounded-xl border border-default">
            {course.lessons.map((lesson, index) => {
              const accessible = owned || lesson.free;
              const isDone = completed.has(lesson.slug);
              return (
                <li
                  key={lesson.slug}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted" />
                    )}
                    <span className="text-sm">
                      {index + 1}. {lesson.title}
                    </span>
                    {lesson.free ? (
                      <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                        Free
                      </span>
                    ) : null}
                  </div>
                  {accessible ? (
                    <Link
                      href={`/courses/${course.id}/${lesson.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-accent"
                    >
                      <PlayCircle className="h-4 w-4" /> Open
                    </Link>
                  ) : (
                    <Lock className="h-4 w-4 text-muted" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <aside className="h-fit rounded-xl border border-default bg-card p-6">
          <p className="text-3xl font-bold">{course.priceLabel}</p>
          <p className="mt-1 text-sm text-muted">One-time · lifetime access</p>
          <div className="mt-6">
            {owned ? (
              <Link
                href={`/courses/${course.id}/${course.lessons[0]?.slug}`}
                className="inline-flex w-full items-center justify-center rounded-md bg-accent px-5 py-3 font-medium text-accent-fg hover:opacity-90"
              >
                Continue learning
              </Link>
            ) : (
              <BuyButton courseId={course.id} priceLabel={course.priceLabel} />
            )}
          </div>
          <p className="mt-4 text-xs text-muted">
            Includes the free intro lesson — try before you buy.
          </p>
        </aside>
      </div>
    </section>
  );
}
