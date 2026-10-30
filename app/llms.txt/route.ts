import { getLlmsText } from "@/lib/seo/discovery";

export function GET() {
    const content = getLlmsText();
    return new Response(content, {
        headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" },
    });
}
