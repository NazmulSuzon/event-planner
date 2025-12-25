import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  await connectDB();

  const { firebaseUid, email, name, photo, provider } = await req.json();

  if (!firebaseUid || !email || !provider) {
    return NextResponse.json(
      { error: "Invalid user data" },
      { status: 400 }
    );
  }

  let user = await User.findOne({ firebaseUid });

  if (!user) {
    user = await User.create({
      firebaseUid,
      email,
      name,
      photo,
      provider,
    });
  }

  return NextResponse.json({ user }, { status: 200 });
}
