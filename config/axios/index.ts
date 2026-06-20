import axios from "axios";
import { getClientFingerprintHash } from "@/lib/fingerprint";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(async (config) => {
    config.headers["x-client-fp"] = await getClientFingerprintHash();
    return config;
});

export default axiosInstance;