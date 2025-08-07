"use client";

import Sidebar from "./components/Sidebar";
import PostCard from "./components/PostCard";
import { useEffect, useState } from "react";

type Author = {
  name: string;
  avatar?: string;
};

type Post = {
  _id: string;
  title: string;
  excerpt: string;
  author: Author;
  createdAt: string;
  tags: string[];
};

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      <Sidebar onSearch={setSearch} />
      <main className="flex-1 p-4">
        {filteredPosts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              id={post._id}
              title={post.title}
              excerpt={post.excerpt}
              author={post.author} // Now an object
              date={post.createdAt}
              tags={post.tags}
            />
          ))
        )}
      </main>
    </div>
  );
}
