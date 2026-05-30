import { readIntroductionContent } from "@/features/introduction/repository";

export async function GET() {
    const content = await readIntroductionContent();

    return Response.json({ data: content });
}
