import { NextResponse } from "next/server";
import Stripe from "stripe";
import { headers } from "next/headers";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Event from "@/models/Event";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  // Handle successful payment
  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object as Stripe.Checkout.Session;

    const metadata = session.metadata;
    const eventId = metadata?.eventId;
    const userId = metadata?.userId;
    const quantity = Number(metadata?.quantity || 1);

    if (!eventId || !userId) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    await connectDB();

    // Prevent duplicate booking
    const alreadyExists = await Booking.findOne({
      stripeSessionId: session.id,
    });

    if (alreadyExists) {
      return NextResponse.json({ ok: true });
    }

    // Check event exists
    const event = await Event.findById(eventId);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const availableTickets = event.totalTickets - (event.ticketsSold || 0);

    if (availableTickets < quantity) {
      await Booking.create({
        userId,
        eventId,
        quantity,
        amountPaid: session.amount_total || 0,
        currency: session.currency || "eur",
        stripeSessionId: session.id,
        paymentIntentId: session.payment_intent?.toString(),
        status: "failed",
      });

      return NextResponse.json(
        { error: "Not enough tickets" },
        { status: 409 }
      );
    }

    // Create booking
    await Booking.create({
      userId,
      eventId,
      quantity,
      amountPaid: session.amount_total || 0,
      currency: session.currency || "eur",
      stripeSessionId: session.id,
      paymentIntentId: session.payment_intent?.toString(),
      status: "paid",
    });

    // Reduce tickets (increase sold)
    await Event.findByIdAndUpdate(eventId, {
      $inc: { ticketsSold: quantity },
    });
  }

  return NextResponse.json({ received: true });
}
