import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import Booking from "@/models/Booking";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs"; // IMPORTANT

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // ✅ Payment completed
  if (event.type === "checkout.session.completed") {
    const session: any = event.data.object;

    const eventId = session.metadata?.eventId;
    const quantity = Number(session.metadata?.quantity || 1);
    const userId = session.metadata?.userId || "guest";

    if (!eventId) {
      return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
    }

    await connectDB();

    // 1️⃣ Reduce tickets safely
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, totalTickets: { $gte: quantity } },
      { $inc: { totalTickets: -quantity } },
      { new: true }
    );

    if (!updatedEvent) {
      // Tickets not available anymore
      await Booking.create({
        userId,
        eventId,
        quantity,
        amountPaid: 0,
        paymentIntentId: session.payment_intent,
        status: "failed",
      });

      return NextResponse.json({ received: true });
    }

    // 2️⃣ Save booking
    await Booking.create({
      userId,
      eventId,
      quantity,
      amountPaid: session.amount_total / 100,
      paymentIntentId: session.payment_intent,
      status: "paid",
    });
  }

  return NextResponse.json({ received: true });
}
