/* eslint-disable @next/next/no-img-element */

import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import mongoose from "mongoose";
import { notFound } from "next/navigation";

export default async function EventDetailsPage({ params }) {
  // ✅ UNWRAP params (THIS IS THE FIX)
  const { id } = await params;

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    notFound();
  }

  const event = await Event.findById(id).lean();

  if (!event) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="w-full h-[400px] overflow-hidden rounded-lg">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-gray-600 mt-2">
            📅 {event.date} · ⏰ {event.time}
          </p>
          <p className="text-gray-600">📍 {event.venue}</p>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-gray-700">{event.description}</p>
          </div>
        </div>

        <div className="border rounded-lg p-6 h-fit sticky top-20">
          <p className="text-2xl font-bold mb-2">
            €{event.ticketPrice}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            {event.totalTickets} tickets left
          </p>

          <button className="btn btn-primary w-full">
            Get tickets
          </button>
        </div>
      </div>
    </div>
  );
}
