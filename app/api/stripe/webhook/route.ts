import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { requireEnv } from "@/lib/env";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      requireEnv("STRIPE_WEBHOOK_SECRET"),
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const sessionObj = event.data.object as Stripe.Checkout.Session;
    const userId = sessionObj.metadata?.userId;
    const courseId = sessionObj.metadata?.courseId;
    if (userId && courseId && sessionObj.payment_status === "paid") {
      try {
        // Idempotent: a repeated webhook for the same purchase is a no-op.
        await prisma.purchase.upsert({
          where: { userId_courseId: { userId, courseId } },
          create: { userId, courseId, stripeSessionId: sessionObj.id },
          update: {},
        });
      } catch (err) {
        console.error("Failed to record purchase:", err);
        return NextResponse.json({ error: "Handler error." }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
