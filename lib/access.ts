import { prisma } from "@/lib/prisma";

export async function hasPurchased(
  userId: string,
  courseId: string,
): Promise<boolean> {
  const purchase = await prisma.purchase.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  return Boolean(purchase);
}

export async function getCompletedLessons(
  userId: string,
  courseId: string,
): Promise<Set<string>> {
  const rows = await prisma.progress.findMany({
    where: { userId, courseId },
    select: { lessonSlug: true },
  });
  return new Set(rows.map((r) => r.lessonSlug));
}
