import { readLandingPageContent } from "@/features/landing-page/repository";

export async function GET() {
    const content = await readLandingPageContent();

    return Response.json({ data: content });
}
