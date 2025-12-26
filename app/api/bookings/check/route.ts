import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import admin from "@/lib/firebaseAdmin";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ booked: false }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    const { eventId } = await req.json();

    await connectDB();

    // convert firebase user to mongodb user
    const mongoUser = await User.findOne({
      firebaseUid: decoded.uid,
    });

    if (!mongoUser) {
      return NextResponse.json({ booked: false });
    }

    const existingBooking = await Booking.findOne({
      userId: mongoUser._id,
      eventId,
      status: "paid",
    });

    return NextResponse.json({
      booked: !!existingBooking,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ booked: false }, { status: 500 });
  }
}
