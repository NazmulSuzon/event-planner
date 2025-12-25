import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import admin from "@/lib/firebaseAdmin";

export async function POST(req: Request) {
  try {
    // Read auth header
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    // Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);

    // Connect DB & get MongoDB user
    await connectDB();

    const mongoUser = await User.findOne({
      firebaseUid: decoded.uid,
    });

    if (!mongoUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Read request body
    const { eventId, title, price } = await req.json();

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: title },
            unit_amount: price * 100,
          },
          quantity: 1,
        },
      ],

      metadata: {
        eventId,
        quantity: "1",
        userId: mongoUser._id.toString(), 
      },

      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Stripe session failed" },
      { status: 500 }
    );
  }
}
