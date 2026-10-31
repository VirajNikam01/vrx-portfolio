"use client";

import { BookshelfFailure } from "@/app/bookshelf/components/organisms/bookshelf-failure";

export default function BookshelfError({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
    return <BookshelfFailure retry={unstable_retry} />;
}
