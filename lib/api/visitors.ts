import { apiClient } from "@/lib/api/client";
import { VisitorPayload } from "@/shared/contracts/visitors-schema";

const save = async (visitorData: VisitorPayload) => {
    await apiClient.post("/visitors", visitorData);
};

export const visitorsApi = {
    save,
};
