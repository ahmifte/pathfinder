import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, Lock } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { getCourse, getLesson } from "@/lib/courses";
import { readLessonBody } from "@/lib/lessons";
import { getCompletedLessons, hasPurchased } from "@/lib/access";
import { BuyButton } from "@/components/buy-button";
import { CompleteButton } from "@/components/complete-button";

export function generateMetadata({
  params,
}: {
  params: { courseId: string; lessonSlug: string };
}): Metadata {
  const found = getLesson(params.courseId, params.lessonSlug);
  if (!found) return {};
  return { title: `${found.lesson.title} — ${found.course.title}` };
}

export default async function LessonPage({
  params,
}: {
  params: { courseId: string; lessonSlug: string };
}) {
  const found = getLesson(params.courseId, params.lessonSlug);
  if (!found) notFound();
  const { course, lesson } = found;

  const session = await getServerSession(authOptions);
  const owned = session?.user?.id
    ? await hasPurchased(session.user.id, course.id)
    : false;
  const accessible = lesson.free || owned;

  // Paywall for gated lessons the user has not purchased.
  if (!accessible) {
    return (
      <section className="container max-w-2xl py-20 text-center">
        <Lock className="mx-auto h-8 w-8 text-muted" />
        <h1 className="mt-4 text-2xl font-bold">This lesson is locked</h1>
        <p className="mt-2 text-muted">
          Get lifetime access to <strong>{course.title}</strong> to unlock this
          and every other lesson.
        </p>
        <div className="mt-6 flex justify-center">
          <BuyButton courseId={course.id} priceLabel={course.priceLabel} />
        </div>
        <p className="mt-6">
          <Link href={`/courses/${course.id}`} className="text-sm text-accent">
            Back to course
          </Link>
        </p>
      </section>
    );
  }

  const body = readLessonBody(course.id, lesson.slug);
  const completed = session?.user?.id
    ? (await getCompletedLessons(session.user.id, course.id)).has(lesson.slug)
    : false;

  const index = course.lessons.findIndex((l) => l.slug === lesson.slug);
  const next = course.lessons[index + 1];

  return (
    <article className="container max-w-2xl py-12">
      <Link
        href={`/courses/${course.id}`}
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-[hsl(var(--foreground))]"
      >
        <ArrowLeft className="h-4 w-4" /> {course.title}
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight">{lesson.title}</h1>

      <div className="mt-8 space-y-4 leading-relaxed">
        {body ? (
          <MDXRemote source={body} />
        ) : (
          <p className="text-muted">Lesson content is coming soon.</p>
        )}
      </div>

      {session?.user?.id ? (
        <div className="mt-10 flex items-center justify-between border-t border-default pt-6">
          <CompleteButton
            courseId={course.id}
            lessonSlug={lesson.slug}
            initialCompleted={completed}
          />
          {next && (owned || next.free) ? (
            <Link
              href={`/courses/${course.id}/${next.slug}`}
              className="text-sm font-medium text-accent"
            >
              Next: {next.title} →
            </Link>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
