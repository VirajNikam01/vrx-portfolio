import { useQuery } from "@tanstack/react-query";

import { getIntroductionContent } from "./api";

export const introductionContentQueryKey = ["introduction"] as const;

export function useIntroductionContent() {
    return useQuery({
        queryKey: introductionContentQueryKey,
        queryFn: getIntroductionContent,
    });
}
