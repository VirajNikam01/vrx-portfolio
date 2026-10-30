import axiosInstance from "@/config/axios";
import { VisitorPayload } from "@/shared/contracts/visitors-schema";

const save = async (visitorData: VisitorPayload) => {
    await axiosInstance.post("/visitors", visitorData);
};

export const visitorsApi = {
    save,
};
