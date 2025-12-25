"use client";

export default function StripeCheckoutButton({ eventId, title, price }) {
  const handleBooking = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId,
        title,
        price,
      }),
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <button onClick={handleBooking} className="btn btn-primary w-full">
      Get tickets
    </button>
  );
}
