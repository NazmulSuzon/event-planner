import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl text-green-600">Payment Successful 🎉</h1>
      <p className="mb-4">Your booking is confirmed.</p>
      <Link href="/" className="border-2 rounded-md bg-black text-white py-2 px-3">Go back to Home</Link>
    </div>
  );
}
