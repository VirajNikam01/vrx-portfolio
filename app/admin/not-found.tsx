import Link from "next/link";
export default function AdminNotFound() { return <div className="space-y-4"><h1 className="text-2xl font-semibold">Content not found</h1><Link href="/admin/bookshelf" className="text-primary underline">Back to your content</Link></div>; }
