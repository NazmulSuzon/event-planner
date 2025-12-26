import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBooking extends Document {
  userId: Types.ObjectId; // MongoDB User _id
  eventId: Types.ObjectId; // MongoDB Event _id
  quantity: number;
  amountPaid: number; // in cents
  currency: string;
  stripeSessionId: string;
  paymentIntentId?: string;
  status: "paid" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },

    quantity: { type: Number, required: true, min: 1 },
    amountPaid: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "eur" },

    stripeSessionId: { type: String, required: true, unique: true },
    
    paymentIntentId: { type: String },
    status: { type: String, enum: ["paid", "failed"], required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);
