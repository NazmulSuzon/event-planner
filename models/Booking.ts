import mongoose, { Schema, Document, Types } from "mongoose";

export interface IBooking extends Document {
  userId: Types.ObjectId;        // MongoDB User reference
  eventId: Types.ObjectId;
  quantity: number;
  amountPaid: number;
  paymentIntentId: string;
  status: "paid" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",               // reference User collection
      required: true,
      index: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    amountPaid: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentIntentId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "failed"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model<IBooking>("Booking", BookingSchema);
