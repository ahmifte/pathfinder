import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { COURSES, getCourse } from "@/lib/courses";
import { getCompletedLessons } from "@/lib/access";
import { AccountActions } from "@/components/account-actions";

export const metadata: Metadata = { title: "My learning" };

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/signin");
  }

  const purchases = await prisma.purchase.findMany({
    where: { userId: session.user.id },
  });

  const owned = await Promise.all(
    purchases.map(async (purchase) => {
      const course = getCourse(purchase.courseId);
      if (!course) return null;
      const completed = await getCompletedLessons(
        session.user.id,
        course.id,
      );
      return {
        course,
        completed: completed.size,
        total: course.lessons.length,
      };
    }),
  );

  const ownedCourses = owned.filter(
    (item): item is NonNullable<typeof item> => item !== null,
  );

  return (
    <section className="container py-12">
      <h1 className="text-2xl font-bold tracking-tight">My learning</h1>
      <p className="text-sm text-muted">{session.user.email}</p>

      {ownedCourses.length === 0 ? (
        <div className="mt-8 rounded-xl border border-default bg-card p-8 text-center">
          <p className="text-muted">You haven&apos;t enrolled in a course yet.</p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:opacity-90"
          >
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {ownedCourses.map(({ course, completed, total }) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="rounded-xl border border-default bg-card p-6 transition-colors hover:border-accent"
            >
              <h2 className="text-lg font-semibold">{course.title}</h2>
              <p className="mt-2 text-sm text-muted">
                {completed} / {total} lessons complete
              </p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[hsl(var(--border))]">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${(completed / total) * 100}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 border-t border-default pt-8">
        <h2 className="mb-4 text-sm font-medium text-muted">Account</h2>
        <AccountActions />
      </div>
    </section>
  );
}
