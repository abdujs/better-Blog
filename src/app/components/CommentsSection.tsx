
"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const CommentForm = dynamic(() => import("@/app/components/CommentForm"), { ssr: false });

interface CommentsSectionProps {
  postId: string;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshIndex, setRefreshIndex] = useState(0);

  useEffect(() => {
    async function fetchComments() {
      setLoading(true);
      try {
        const res = await fetch(`/api/comments`, { cache: "no-store" });
        if (!res.ok) throw new Error();
        const allComments = await res.json();
        setComments(allComments.filter((c: any) => c.post?._id === postId || c.post === postId));
      } catch {
        setComments([]);
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [postId, refreshIndex]);

  function handleCommentAdded() {
    setRefreshIndex((i) => i + 1);
  }

  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
      {loading ? (
        <p className="text-gray-500">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        <ul className="space-y-6">
          {comments.map((comment) => (
            <li key={comment._id} className="border-b pb-4">
              <div className="flex items-center mb-1">
                <span className="font-medium text-gray-800 mr-2">{comment.author?.name || "Anonymous"}</span>
                <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-gray-700 whitespace-pre-line">{comment.content}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
