import React from 'react';

const ServiceCard = ({title, description, venue, date, time, totalTickets, ticketPrice, imageUrl}) => {
    return (
        <div className="card bg-base-100 text-white mt-8 w-80 shadow-sm border-2 border-black hover:shadow-lg hover:scale-105 transition-transform duration-300">
      <figure className="h-40 overflow-hidden">
        <img src={imageUrl} alt="Shoes" />
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-lg">
          {title}
        </h2>
        <p className="text-sm">
          {description}
        </p>
        <p>{venue}</p>
        <div>
            <p>{date} at {time}</p>
            <p>{totalTickets} tickets available</p>
            <p>Price: ${ticketPrice}</p>
        </div>
        <div className="card-actions flex items-center justify-end">
          <div className="badge badge-outline text-xs">View Details</div>
          <button className="btn btn-sm btn-primary">Book Now!</button>
        </div>
      </div>
    </div>
    );
};

export default ServiceCard;