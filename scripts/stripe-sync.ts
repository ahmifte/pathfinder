import Stripe from "stripe";
import { COURSES, type Course } from "../lib/courses";

// Idempotent provisioning: makes the connected Stripe account match the course
// catalog in lib/courses.ts. Run with `pnpm stripe:sync`. The account targeted
// is whatever STRIPE_SECRET_KEY belongs to — run it with your personal key and
// everything is created in your personal account.

type Result = "created" | "updated" | "unchanged";

async function ensureProduct(
  stripe: Stripe,
  id: string,
  name: string,
  description: string,
): Promise<void> {
  try {
    await stripe.products.retrieve(id);
    await stripe.products.update(id, { name, description, active: true });
  } catch (err) {
    if (err instanceof Stripe.errors.StripeInvalidRequestError && err.code === "resource_missing") {
      await stripe.products.create({ id, name, description, metadata: { app_key: id } });
      return;
    }
    throw err;
  }
}

async function syncCourse(stripe: Stripe, course: Course): Promise<Result> {
  const productId = `pathfinder_${course.id}`;
  await ensureProduct(stripe, productId, course.title, course.description);

  const { data } = await stripe.prices.list({
    lookup_keys: [course.lookupKey],
    active: true,
    limit: 1,
  });
  const existing = data[0];

  // One-time price: no recurring interval.
  const matches =
    existing &&
    existing.unit_amount === course.amount &&
    existing.currency === course.currency &&
    existing.type === "one_time";

  if (matches) return "unchanged";

  await stripe.prices.create({
    product: productId,
    unit_amount: course.amount,
    currency: course.currency,
    lookup_key: course.lookupKey,
    transfer_lookup_key: true,
  });
  if (existing) {
    await stripe.prices.update(existing.id, { active: false });
    return "updated";
  }
  return "created";
}

async function main(): Promise<void> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error(
      "Missing STRIPE_SECRET_KEY. Set it in .env.local (the script is run with --env-file=.env.local).",
    );
    process.exit(1);
  }

  const stripe = new Stripe(key, { apiVersion: "2024-06-20" });

  console.log(`Syncing ${COURSES.length} course(s) to Stripe...`);
  for (const course of COURSES) {
    const result = await syncCourse(stripe, course);
    console.log(`  ${course.lookupKey}: ${result}`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
