import { visitorsApi } from "@/lib/api/visitors";
import { useMutation } from "@tanstack/react-query";


export const useVisitorMutation = () => {
    return useMutation({
        mutationFn: visitorsApi.save,
    })

}   