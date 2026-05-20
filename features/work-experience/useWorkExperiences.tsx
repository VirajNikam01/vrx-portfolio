import { useQuery } from "@tanstack/react-query";

import { workExperiences } from "@/config/work-experience";
import { getWorkExperiences } from "./api";

export const workExperienceQueryKey = ["work-experience"] as const;

export function useWorkExperiences() {
    return useQuery({
        queryKey: workExperienceQueryKey,
        queryFn: getWorkExperiences,
        initialData: workExperiences,
    });
}
