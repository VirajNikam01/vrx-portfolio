import axios from "axios";
import { getOrCreateVisitorId } from "@/lib/fingerprint";

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use((requestConfig) => {
    requestConfig.headers["x-client-fp"] = getOrCreateVisitorId();
    return requestConfig;
});
