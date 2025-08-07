"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white py-4 px-6 flex items-center justify-between">
      <div className="text-2xl font-bold text-gray-900">
        <Link href="/">Better Blog</Link>
      </div>
      <nav className="space-x-6">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </nav>
    </header>
  );
}
