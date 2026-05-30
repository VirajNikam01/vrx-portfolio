import { readWorkExperiences } from "@/features/work-experience/repository";

export async function GET() {
    const content = await readWorkExperiences();

    return Response.json({ data: content });
}
