import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { resolvePriceId } from "@/lib/stripe-prices";
import { getCourse } from "@/lib/courses";
import { hasPurchased } from "@/lib/access";
import { env } from "@/lib/env";

const schema = z.object({ courseId: z.string().min(1) });

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 422 });
  }

  const course = getCourse(parsed.data.courseId);
  if (!course) {
    return NextResponse.json({ error: "Unknown course." }, { status: 404 });
  }

  // Don't let someone pay twice for the same lifetime-access course.
  if (await hasPurchased(session.user.id, course.id)) {
    return NextResponse.json(
      { error: "You already own this course." },
      { status: 409 },
    );
  }

  let priceId: string;
  try {
    priceId = await resolvePriceId(course.lookupKey);
  } catch (err) {
    console.error("Failed to resolve Stripe price:", err);
    return NextResponse.json(
      { error: "Checkout is not configured. Run `pnpm stripe:sync`." },
      { status: 503 },
    );
  }

  const stripe = getStripe();
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  let customerId = user?.stripeCustomerId ?? undefined;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: session.user.email,
      metadata: { userId: session.user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: session.user.id },
      data: { stripeCustomerId: customerId },
    });
  }

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?purchased=1`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/courses/${course.id}`,
    metadata: { userId: session.user.id, courseId: course.id },
  });

  return NextResponse.json({ url: checkout.url });
}
