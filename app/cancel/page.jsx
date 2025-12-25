import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl text-red-600">Payment Cancelled</h1>
      <p className="mt-4">Your payment was not successful. Please try again.</p>
      <p className="my-4">If you believe this is an error, please contact support.</p>
      <Link href="/" className="border-2 rounded-md bg-black text-white px-3 py-2">Go back to Home</Link>
    </div>
  );
}
