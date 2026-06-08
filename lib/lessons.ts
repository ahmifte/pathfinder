import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const COURSES_DIR = path.join(process.cwd(), "content", "courses");

// Read a lesson's MDX body from disk. Returns null if the file does not exist
// so callers can render a friendly fallback.
export function readLessonBody(
  courseId: string,
  lessonSlug: string,
): string | null {
  const fullPath = path.join(COURSES_DIR, courseId, `${lessonSlug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;
  const raw = fs.readFileSync(fullPath, "utf8");
  return matter(raw).content;
}
