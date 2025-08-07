import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/comments";
import { requireRole } from "@/lib/roleMiddleware"; // Add this import

// GET: Get a single comment by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const comment = await Comment.findById(params.id)
    .populate("author", "name email")
    .populate("post", "title");
  if (!comment) {
    return NextResponse.json({ error: "Comment not found." }, { status: 404 });
  }
  return NextResponse.json(comment);
}

// PUT: Update a comment by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  // Role check
  const roleCheck = await requireRole(["author", "admin"])(req);
  if (roleCheck instanceof NextResponse) return roleCheck;

  await dbConnect();
  const { content } = await req.json();
  const comment = await Comment.findByIdAndUpdate(
    params.id,
    { content },
    { new: true }
  );
  if (!comment) {
    return NextResponse.json({ error: "Comment not found." }, { status: 404 });
  }
  return NextResponse.json(comment);
}

// DELETE: Delete a comment by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  // Role check
  const roleCheck = await requireRole(["author", "admin"])(req);
  if (roleCheck instanceof NextResponse) return roleCheck;

  await dbConnect();
  const comment = await Comment.findByIdAndDelete(params.id);
  if (!comment) {
    return NextResponse.json({ error: "Comment not found." }, { status: 404 });
  }
  return NextResponse.json({ message: "Comment deleted successfully." });
}