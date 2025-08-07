
"use client";
import React, { useState } from "react";

interface CommentFormProps {
  postId: string;
  onCommentAdded: () => void;
}

export default function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // TODO: Replace with real user info from auth context/session
  const fakeAuthor = typeof window !== "undefined" && localStorage.getItem("userId");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!content.trim()) {
      setError("Comment cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          post: postId,
          author: fakeAuthor || "demo-user-id", // Replace with real user id
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to add comment.");
      } else {
        setContent("");
        setSuccess("Comment added!");
        onCommentAdded();
      }
    } catch (err) {
      setError("Failed to add comment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 mb-4">
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows={3}
        placeholder="Write your comment..."
        value={content}
        onChange={e => setContent(e.target.value)}
        disabled={loading}
      />
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Posting..." : "Add Comment"}
      </button>
    </form>
  );
}
