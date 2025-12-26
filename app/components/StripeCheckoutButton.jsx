"use client";

import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

export default function StripeCheckoutButton({
  eventId,
  title,
  price,
  availableTickets,
}) {
  const auth = getAuth();

  const [alreadyBooked, setAlreadyBooked] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkBookingStatus = async () => {
      const user = auth.currentUser;

      // Not logged in → no booking
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        const token = await user.getIdToken();

        const res = await fetch("/api/bookings/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ eventId }),
        });

        const data = await res.json();
        setAlreadyBooked(data.booked);
      } catch (error) {
        console.error("Booking check failed", error);
      } finally {
        setChecking(false);
      }
    };

    checkBookingStatus();
  }, [eventId, auth]);

  const handleBooking = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please log in to book tickets.");
      return;
    }

    const token = await user.getIdToken();

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        eventId,
        title,
        price,
      }),
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  // Loading state
  if (checking) {
    return (
      <button className="btn btn-disabled w-full">
        Checking availability...
      </button>
    );
  }

  // Sold out
  if (availableTickets === 0) {
    return (
      <button className="btn btn-disabled w-full">
        Sold Out
      </button>
    );
  }

  // Already booked
  if (alreadyBooked) {
    return (
      <button className="btn text-white text-2xl btn-disabled bg-red-500">
        Already Booked
      </button>
    );
  }

  // Ready to book
  return (
    <button onClick={handleBooking} className="btn btn-primary w-full">
      Get Tickets
    </button>
  );
}
