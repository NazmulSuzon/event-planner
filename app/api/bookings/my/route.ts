import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Booking from "@/models/Booking";
import User from "@/models/User";
import admin from "@/lib/firebaseAdmin";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    await connectDB();

    // Find MongoDB user
    const mongoUser = await User.findOne({
      firebaseUid: decoded.uid,
    });

    if (!mongoUser) {
      return NextResponse.json({ bookings: [] });
    }

    // Get bookings + event info
    const bookings = await Booking.find({
      userId: mongoUser._id,
      status: "paid",
    }).populate("eventId");

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
