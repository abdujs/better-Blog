
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";

interface Post {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  author?: {
    name?: string;
    email?: string;
  };
}

const CommentsSection = dynamic(() => import("@/app/components/CommentsSection"), { ssr: false });

export default async function PostDetailsPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/posts/${params.id}`, {
    cache: "no-store",
  });
  if (!res.ok) return notFound();
  const post: Post = await res.json();

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="text-gray-500 text-sm mb-2">
        By {post.author?.name || "Unknown"} &middot; {new Date(post.createdAt).toLocaleDateString()}
      </div>
      <article className="prose prose-lg max-w-none mb-8">
        {post.content}
      </article>
      {/* Comments Section (Client Component) */}
      <CommentsSection postId={post._id} />
    </div>
  );
}
