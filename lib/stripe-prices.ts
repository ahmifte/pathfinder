import { getStripe } from "@/lib/stripe";

// Resolve a stable lookup_key to a live Stripe price ID. Prices are created by
// `pnpm stripe:sync`, which tags each with a lookup_key — so the app never has
// to know opaque price IDs or read them from the environment.
const cache = new Map<string, string>();

export async function resolvePriceId(lookupKey: string): Promise<string> {
  const cached = cache.get(lookupKey);
  if (cached) return cached;

  const stripe = getStripe();
  const { data } = await stripe.prices.list({
    lookup_keys: [lookupKey],
    active: true,
    limit: 1,
  });

  const id = data[0]?.id;
  if (!id) {
    throw new Error(
      `No active Stripe price for lookup_key "${lookupKey}". Run \`pnpm stripe:sync\`.`,
    );
  }

  cache.set(lookupKey, id);
  return id;
}
