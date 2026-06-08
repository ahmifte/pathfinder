import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLesson } from "@/lib/courses";
import { hasPurchased } from "@/lib/access";

const schema = z.object({
  courseId: z.string().min(1),
  lessonSlug: z.string().min(1),
  completed: z.boolean(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 422 });
  }

  const { courseId, lessonSlug, completed } = parsed.data;
  const found = getLesson(courseId, lessonSlug);
  if (!found) {
    return NextResponse.json({ error: "Unknown lesson." }, { status: 404 });
  }

  // Only purchasers (or free lessons) can record progress.
  const allowed =
    found.lesson.free || (await hasPurchased(session.user.id, courseId));
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  if (completed) {
    await prisma.progress.upsert({
      where: {
        userId_courseId_lessonSlug: {
          userId: session.user.id,
          courseId,
          lessonSlug,
        },
      },
      create: { userId: session.user.id, courseId, lessonSlug },
      update: {},
    });
  } else {
    await prisma.progress.deleteMany({
      where: { userId: session.user.id, courseId, lessonSlug },
    });
  }

  return NextResponse.json({ ok: true });
}
