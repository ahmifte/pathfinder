// Courses are defined in code and their lesson bodies live as MDX files in
// content/courses/<courseId>/<lessonSlug>.mdx. Adding a course = adding an entry
// here plus the matching MDX files. Each course defines its price by amount + a
// stable `lookupKey`; the Stripe price object is provisioned by
// `pnpm stripe:sync` and resolved at runtime via lib/stripe-prices.ts.

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
  lookupKey: string;
  amount: number; // one-time charge in the currency's smallest unit (cents)
  currency: string;
  lessons: Lesson[];
};

export const COURSES: Course[] = [
  {
    id: "ship-ai-saas",
    title: "Build & Sell an AI SaaS with Next.js + Stripe",
    description:
      "Go from empty repo to a paid, production AI SaaS: auth, subscriptions, usage metering, and the AI feature itself.",
    priceLabel: "$149",
    lookupKey: "pathfinder_ship_ai_saas",
    amount: 14900,
    currency: "usd",
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
    lookupKey: "pathfinder_rag_in_production",
    amount: 12900,
    currency: "usd",
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
