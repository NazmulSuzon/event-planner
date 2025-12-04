import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { title, description, venue, date, time, totalTickets, ticketPrice, imageUrl } = body;

    // Validation
    if (!title || !description || !venue || !date || !time || !totalTickets || !ticketPrice) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const event = new Event({
      title,
      description,
      venue,
      date,
      time,
      totalTickets: Number(totalTickets),
      ticketPrice: Number(ticketPrice),
      imageUrl: imageUrl || "",
    });

    await event.save();

    return NextResponse.json(
      { message: "Event created successfully", event },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create event" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const events = await Event.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ events }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}