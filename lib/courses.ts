import { env } from "@/lib/env";

// Courses are defined in code and their lesson bodies live as MDX files in
// content/courses/<courseId>/<lessonSlug>.mdx. Adding a course = adding an entry
// here plus the matching MDX files. Stripe price IDs come from the environment.

export type Lesson = {
  slug: string;
  title: string;
  // Free lessons are the public funnel; the rest are gated behind a purchase.
  free?: boolean;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  priceLabel: string;
  stripePriceId?: string;
  lessons: Lesson[];
};

export const COURSES: Course[] = [
  {
    id: "ship-ai-saas",
    title: "Build & Sell an AI SaaS with Next.js + Stripe",
    description:
      "Go from empty repo to a paid, production AI SaaS: auth, subscriptions, usage metering, and the AI feature itself.",
    priceLabel: "$149",
    stripePriceId: env.STRIPE_PRICE_SHIP_AI_SAAS,
    lessons: [
      { slug: "introduction", title: "Introduction & what you'll build", free: true },
      { slug: "auth-and-billing", title: "Wiring auth and Stripe subscriptions" },
      { slug: "usage-metering", title: "Enforcing per-plan usage limits" },
      { slug: "launch", title: "Launching and getting your first customers" },
    ],
  },
  {
    id: "rag-in-production",
    title: "RAG in Production",
    description:
      "Build retrieval-augmented assistants that are accurate, measurable, and safe to ship to real users.",
    priceLabel: "$129",
    stripePriceId: env.STRIPE_PRICE_RAG_IN_PRODUCTION,
    lessons: [
      { slug: "introduction", title: "Why naive RAG fails", free: true },
      { slug: "chunking-and-retrieval", title: "Chunking and retrieval that works" },
      { slug: "evals", title: "Evaluating answer quality" },
    ],
  },
];

export function getCourse(courseId: string): Course | undefined {
  return COURSES.find((c) => c.id === courseId);
}

export function getLesson(
  courseId: string,
  lessonSlug: string,
): { course: Course; lesson: Lesson } | undefined {
  const course = getCourse(courseId);
  if (!course) return undefined;
  const lesson = course.lessons.find((l) => l.slug === lessonSlug);
  if (!lesson) return undefined;
  return { course, lesson };
}
