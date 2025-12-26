/* eslint-disable @next/next/no-img-element */
"use client";
import { getAuth } from "firebase/auth";
import Link from "next/link";
import { useEffect, useState } from "react";

const EventCard = ({
  _id,
  title,
  description,
  venue,
  date,
  time,
  totalTickets,
  ticketsSold,
  ticketPrice,
  imageUrl,
  eventType,
}) => {
  const auth = getAuth();

  const [alreadyBooked, setAlreadyBooked] = useState(false);

  useEffect(() => {
    const checkBooking = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const token = await user.getIdToken();

      const res = await fetch("/api/bookings/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: _id }),
      });

      const data = await res.json();
      setAlreadyBooked(data.booked);
    };

    checkBooking();
  }, [_id]);

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
        eventId: _id,
        title,
        price: ticketPrice,
      }),
    });
    const data = await res.json();
    window.location.href = data.url;
  };

  const availableTickets = totalTickets - (ticketsSold || 0);

  return (
    <div className="card bg-base-100 text-white mt-8 w-80 shadow-sm border-2 border-black hover:shadow-lg hover:scale-105 transition-transform duration-300">
      <figure className="h-40 overflow-hidden">
        <img src={imageUrl} alt="Shoes" />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-lg">{title}</h2>
        <p className="text-sm">{description}</p>
        <p>{venue}</p>
        <div>
          <p>
            {date} at {time}
          </p>
          <p>{eventType}</p>
          <p>{availableTickets} tickets available</p>
          <p>Price: ${ticketPrice}</p>
        </div>
        <div className="card-actions flex items-center justify-end">
          <Link href={`/events/${_id}`} className="badge badge-outline text-xs">
            {" "}
            View Details{" "}
          </Link>
          {availableTickets === 0 && (
            <span className="text-red-500 font-bold">Sold Out</span>
          )}

          <button
            disabled={availableTickets === 0 || alreadyBooked}
            onClick={handleBooking}
            className={`btn btn-sm ${
              alreadyBooked ? "btn-disabled" : "btn-primary"
            }`}
          >
            {alreadyBooked ? "Already Booked" : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
