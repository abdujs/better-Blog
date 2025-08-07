import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user";
import Post from "@/models/post";
import Comment from "@/models/comments";
import { requireRole } from "@/lib/roleMiddleware";

// GET: Admin dashboard - list all users, posts, comments, and analytics
export async function GET(req: NextRequest) {
    // Check if user has admin role
    const roleCheck = await requireRole(["admin"])(req);
    if (roleCheck instanceof NextResponse) return roleCheck;

    // Connect to database
    await dbConnect();
    // Fetch all users (excluding passwords)
    const users = await User.find().select("-password");
    // Fetch all posts
    const posts = await Post.find();
    // Fetch all comments
    const comments = await Comment.find();

    // Gather simple analytics (counts)
    const analytics = {
        userCount: await User.countDocuments(),
        postCount: await Post.countDocuments(),
        commentCount: await Comment.countDocuments(),
    };

    // Return all data as JSON
    return NextResponse.json({ users, posts, comments, analytics });
}

// DELETE: Delete a user, post, or comment (expects type and id in body)
export async function DELETE(req: NextRequest) {
    // Check if user has admin role
    const roleCheck = await requireRole(["admin"])(req);
    if (roleCheck instanceof NextResponse) return roleCheck;

    // Connect to database
    await dbConnect();
    // Parse type and id from request body
    const { type, id } = await req.json();

    let result;
    // Delete based on type
    if (type === "user") {
        result = await User.findByIdAndDelete(id);
    } else if (type === "post") {
        result = await Post.findByIdAndDelete(id);
    } else if (type === "comment") {
        result = await Comment.findByIdAndDelete(id);
    } else {
        // Invalid type provided
        return NextResponse.json({ error: "Invalid type." }, { status: 400 });
    }

    // If not found, return error
    if (!result) {
        return NextResponse.json({ error: `${type} not found.` }, { status: 404 });
    }
    // Return success message
    return NextResponse.json({ message: `${type} deleted successfully.` });
}

// PUT: Update a user, post, or comment (expects type, id, and updateFields in body)
export async function PUT(req: NextRequest) {
    // Check if user has admin role
    const roleCheck = await requireRole(["admin"])(req);
    if (roleCheck instanceof NextResponse) return roleCheck;

    // Connect to database
    await dbConnect();
    // Parse type, id, and updateFields from request body
    const { type, id, updateFields } = await req.json();

    let result;
    // Update based on type
    if (type === "user") {
        result = await User.findByIdAndUpdate(id, updateFields, { new: true }).select("-password");
    } else if (type === "post") {
        result = await Post.findByIdAndUpdate(id, updateFields, { new: true });
    } else if (type === "comment") {
        result = await Comment.findByIdAndUpdate(id, updateFields, { new: true });
    } else {
        // Invalid type provided
        return NextResponse.json({ error: "Invalid type." }, { status: 400 });
    }

    // If not found, return error
    if (!result) {
        return NextResponse.json({ error: `${type} not found.` }, { status: 404 });
    }
    // Return success message and updated result
    return NextResponse.json({ message: `${type} updated successfully.`, result });
}