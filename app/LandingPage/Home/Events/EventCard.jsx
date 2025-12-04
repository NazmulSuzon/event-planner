"use client";
import React from "react";

const EventCard = ({img, title, details}) => {
  return (
    <div className="card bg-base-100 text-white mt-8 w-80 shadow-sm">
      <figure className="h-40 overflow-hidden">
        <img src={img} alt="Shoes" />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-lg">
          {title}
          <div className="badge badge-secondary text-xs">NEW</div>
        </h2>
        <p className="text-sm">
          {details}
        </p>
        <div className="card-actions justify-end">
          <div className="badge badge-outline text-xs">View Details</div>
          <div className="badge badge-outline text-xs">Book</div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
