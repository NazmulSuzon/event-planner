"use client";
import { useState, useRef } from "react";
import Calender from "./Calender";
import ImagePicker from "./ImagePicker";

const CreateEvent = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    let imageUrl = "";

    if (selectedImage) {
      imageUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(selectedImage);
      });
    }

    const eventData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      venue: formData.get("venue") as string,
      date: selectedDate,
      time: formData.get("time") as string,
      totalTickets: formData.get("totalTickets") as string,
      ticketPrice: formData.get("ticketPrice") as string,
      imageUrl: imageUrl,
    };

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create event");
      }

      setMessage({ type: "success", text: "Event created successfully!" });
      formRef.current?.reset();
      setSelectedDate("");
      setSelectedImage(null);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create an Event</h1>

      {message && (
        <div
          className={`alert mt-4 ${
            message.type === "success" ? "alert-success" : "alert-error"
          }`}
        >
          <span>{message.text}</span>
        </div>
      )}

      <form ref={formRef} className="space-y-4" onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label className="label text-black font-bold">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            name="title"
            required
            className="input input-bordered bg-white border-2 border-black w-full"
            placeholder="Enter event title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="label text-black font-bold">
            <span className="label-text">Description</span>
          </label>
          <textarea
            name="description"
            required
            rows={4}
            placeholder="Enter event description"
            className="textarea textarea-bordered bg-white border-2 border-black w-full"
          />
        </div>

        {/* Venue */}
        <div>
          <label className="label text-black font-bold">
            <span className="label-text">Venue</span>
          </label>
          <input
            type="text"
            name="venue"
            required
            className="input input-bordered bg-white border-2 border-black w-full"
            placeholder="Enter venue location"
          />
        </div>

        {/* Date */}
        <div>
          <Calender onDateChange={setSelectedDate} />
        </div>

        {/* Time */}
        <div>
          <label className="label text-black font-bold">
            <span className="label-text">Time</span>
          </label>
          <input
            type="time"
            name="time"
            required
            className="input input-bordered bg-white border-2 border-black text-black [color-scheme:light] w-full"
          />
        </div>

        {/* Total Tickets */}
        <div>
          <label className="label text-black font-bold">
            <span className="label-text">Total Tickets</span>
          </label>
          <input
            type="number"
            name="totalTickets"
            required
            min="1"
            className="input input-bordered bg-white border-2 border-black text-black [color-scheme:light] w-full"
            placeholder="Enter total number of tickets"
          />
        </div>

        {/* Ticket Price */}
        <div>
          <label className="label text-black font-bold">
            <span className="label-text">Ticket Price</span>
          </label>
          <input
            type="number"
            name="ticketPrice"
            required
            min="0"
            step="0.01"
            className="input input-bordered bg-white border-2 border-black text-black [color-scheme:light] w-full"
            placeholder="Enter ticket price"
          />
        </div>

        {/* Image Picker */}
        <div>
          <ImagePicker onImageSelect={setSelectedImage} />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="btn btn-neutral w-full"
            disabled={loading}
          >
            {loading ? "Creating Event..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;