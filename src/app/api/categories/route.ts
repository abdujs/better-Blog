import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/post";

export async function GET() {
  await dbConnect();

  // Get all unique tags from posts
  const categories = await Post.distinct("tags");

  return NextResponse.json(categories);
}