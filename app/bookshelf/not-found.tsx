import Link from "next/link";

export default function BookshelfNotFound() {
    return <div className="space-y-4 py-12 text-center"><h2 className="text-xl font-semibold">This item is not on the shelf</h2><Link href="/bookshelf" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">Back to bookshelf</Link></div>;
}
