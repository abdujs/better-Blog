import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/post";

// GET: Get a single post by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const post = await Post.findById(params.id).populate("author", "name email");
  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }
  return NextResponse.json(post);
}

// PUT: Update a post by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { title, content } = await req.json();
  const post = await Post.findByIdAndUpdate(
    params.id,
    { title, content },
    { new: true }
  );
  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }
  return NextResponse.json(post);
}

// DELETE: Delete a post by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const post = await Post.findByIdAndDelete(params.id);
  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }
  return NextResponse.json({ message: "Post deleted successfully." });
}