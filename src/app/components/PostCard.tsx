import Link from "next/link";

type PostCardProps = {
    id: string;
    title: string;
    excerpt: string;
    author: {
        name: string;
        avatar?: string;
    };
    date: string;
    tags?: string[];
};

export default function PostCard({
    id,
    title,
    excerpt,
    author,
    date,
    tags = [],
}: PostCardProps) {
    // Format date
    const formattedDate = new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    // Truncate excerpt (optional)
    const shortExcerpt = excerpt.length > 150 ? excerpt.slice(0, 150) + "..." : excerpt;

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">
                <Link href={`/posts/${id}`} className="text-blue-600 hover:underline">
                    {title}
                </Link>
            </h2>
            <p className="text-gray-700 mb-4">{shortExcerpt}</p>
            <div className="flex items-center mb-4">
                <img
                    src={author.avatar || "/default-avatar.png"}
                    alt={author.name}
                    className="w-10 h-10 rounded-full mr-2"
                    title={author.name}
                />
                <span className="text-sm text-gray-600">{author.name}</span>
            </div>
            <div className="text-sm text-gray-500 mb-4">{formattedDate}</div>
            {tags.length > 0 && (
                <div className="flex flex-wrap">
                    {tags.map((tag) => (
                        <span
                            key={tag}
                            className="bg-blue-100 text-blue-600 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}