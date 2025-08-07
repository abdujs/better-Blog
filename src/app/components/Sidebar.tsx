"use client";
import { useEffect, useState } from "react";

type Category = string;
type Post = {
  _id: string;
  title: string;
};

type SidebarProps = {
  onSearch: (query: string) => void;
};

export default function Sidebar({ onSearch }: SidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Fetch categories/tags
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []));
    // Fetch recent posts
    fetch("/api/posts?limit=5")
      .then((res) => res.json())
      .then((data) => setRecentPosts(data.posts || []));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search);
  };

  return (
    <aside className="w-full md:w-64 bg-gray-50 p-4 rounded-lg shadow mb-6 md:mb-0">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Search</h3>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Categories</h3>
        <ul className="text-sm text-gray-700">
          {categories.length === 0 ? (
            <li className="mb-1">No categories yet</li>
          ) : (
            categories.map((cat) => (
              <li key={cat} className="mb-1 cursor-pointer hover:underline">
                {cat}
              </li>
            ))
          )}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Recent Posts</h3>
        <ul className="text-sm text-gray-700">
          {recentPosts.length === 0 ? (
            <li>No recent posts</li>
          ) : (
            recentPosts.map((post) => (
              <li key={post._id} className="mb-1">
                <a href={`/posts/${post._id}`} className="hover:underline">
                  {post.title}
                </a>
              </li>
            ))
          )}
        </ul>
      </div>
    </aside>
  );
}