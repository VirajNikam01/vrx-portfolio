import { visitorService } from "@/actions/visitor";
import { useMutation } from "@tanstack/react-query";


export const useVisitorMutation = () => {
    return useMutation({
        mutationFn: visitorService.save,
    })

}   