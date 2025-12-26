"use client";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

export default function MyTicketsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const fetchTickets = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      const token = await user.getIdToken();

      const res = await fetch("/api/bookings/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setBookings(data.bookings || []);
      setLoading(false);
    };

    fetchTickets();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading tickets...</p>;
  }

  if (bookings.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">
        You have not booked any events yet.
      </p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🎟️ My Tickets</h1>

      <div className="grid gap-6">
        {bookings.map((booking) => {
          const event = booking.eventId;

          return (
            <div
              key={booking._id}
              className="border rounded-lg p-4 shadow-md bg-white"
            >
              <h2 className="text-xl font-bold">{event.title}</h2>
              <p className="text-gray-600">{event.venue}</p>
              <p>
                📅 {event.date} · ⏰ {event.time}
              </p>
              <p>🎫 Quantity: {booking.quantity}</p>
              <p>💰 Paid: €{booking.amountPaid}</p>
              <p className="text-green-600 font-semibold">Status: PAID</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
