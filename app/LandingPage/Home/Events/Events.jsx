"use client";

import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");

        if (!res.ok) {
          throw new Error("Failed to fetch events");
        }

        const data = await res.json();
        setEvents(data.events); // ✅ VERY IMPORTANT
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading events...</p>;
  }

  return (
    <div>
      <h1 className="text-center my-12 text-3xl text-green-700">
        Explore Events
      </h1>

      <div className="flex flex-wrap justify-center gap-6">
        {events.length === 0 ? (
          <p>No events found</p>
        ) : (
          events.map((event) => (
            <EventCard
              key={event._id}
              _id={event._id}
              title={event.title}
              description={event.description}
              venue={event.venue}
              date={event.date}
              time={event.time}
              totalTickets={event.totalTickets}
              ticketPrice={event.ticketPrice}
              imageUrl={event.imageUrl}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
