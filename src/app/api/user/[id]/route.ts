import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import { verifyToken } from "@/lib/auth";

// GET: Get user profile by ID (restricted to logged-in users)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  // Token check: only logged-in users can view profiles
  const token = req.cookies.get("token")?.value;
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(params.id).select("-password");
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }
  return NextResponse.json(user);
}

// PUT: Update user profile by ID (with bio and avatar)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  // Get token and verify user
  const token = req.cookies.get("token")?.value;
  const payload = token ? verifyToken(token) : null;

  // Only allow profile owner or admin to update
  if (!payload || (payload.userId !== params.id && payload.role !== "admin")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Accept additional fields (bio, avatar)
  const { name, email, bio, avatar } = await req.json();
  const updateFields: any = {};
  if (name) updateFields.name = name;
  if (email) updateFields.email = email;
  if (bio) updateFields.bio = bio;
  if (avatar) updateFields.avatar = avatar;

  const user = await User.findByIdAndUpdate(
    params.id,
    updateFields,
    { new: true }
  ).select("-password");
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }
  return NextResponse.json({
    message: "Profile updated successfully.",
    user
  });
}