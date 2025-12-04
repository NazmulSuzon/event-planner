"use client";
import React, { useState } from "react";
import EventCard from "./EventCard";
import events from "../../../FakeData/Evemt.json"; // adjust path based on location

const Events = () => {
    const [visible, setVisible] = useState(3);

    const loadMore = () => {
    setVisible(events.length); // show all cards on click
  };

  return (
    <div className="p-4 container mx-auto">
        <h1 className="text-center text-2xl">Upcoming Events...</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3">
        {events.slice(0, visible).map((event) => (
          <EventCard
            key={event.id}
            img={event.img}
            title={event.title}
            details={event.details}
          />
        ))}
      </div>

      {/* Load More Button */}
      {visible < events.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMore}
            className="btn btn-primary"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default Events;
