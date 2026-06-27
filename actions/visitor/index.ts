import axiosInstance from "@/config/axios";
import { VisitorPayload } from "@/features/visitors/schema";

const save = async (visitorData: VisitorPayload) => {
    await axiosInstance.post("/visitors", visitorData);
};

export const visitorService = {
    save,
};