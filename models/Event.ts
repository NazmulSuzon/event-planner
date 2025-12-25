import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  eventType: string;
  venue: string;
  date: string;
  time: string;
  totalTickets: number;
  ticketPrice: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    eventType: {
      type: String,
      required: [true, "Event type is required"],
      enum: [
        "music",
        "sports",
        "tech",
        "healthFitness",
        "conference",
        "party",
        "meetup",
        "seminar",
        "festival",
        "networking",
      ],
    },
    venue: {
      type: String,
      required: [true, "Venue is required"],
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    time: {
      type: String,
      required: [true, "Time is required"],
    },
    totalTickets: {
      type: Number,
      required: [true, "Total tickets is required"],
      min: [1, "Must have at least 1 ticket"],
    },
    ticketPrice: {
      type: Number,
      required: [true, "Ticket price is required"],
      min: [0, "Price cannot be negative"],
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Event =
  mongoose.models.Event ??
  mongoose.model<IEvent>("Event", EventSchema);


export default Event;