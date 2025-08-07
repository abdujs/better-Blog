import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Post from "@/models/post";

export async function GET() {
    await dbConnect();
    const posts = await Post.find().populate("author", "name email");
    return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
    await dbConnect();
    const { title, content, author } = await req.json();
    if (!title || !content || !author) {
        return NextResponse.json({
            error: "All fields are required."
        }, { status: 400 });
    } 

const post = await Post.create({ title, content, author }); 
  return NextResponse.json(post, { status: 201 }); 
}