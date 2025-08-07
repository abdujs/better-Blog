import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Comment from "@/models/comments";

// GET: List all comments
export async function GET() {
  await dbConnect();
  const comments = await Comment.find()
    .populate("author", "name email")
    .populate("post", "title");
  return NextResponse.json(comments);
}

// POST: Create a new comment
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { content, author, post } = await req.json();

    if (!content || !author || !post) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const comment = await Comment.create({ content, author, post });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error(error); // This will show the error in your server logs
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}