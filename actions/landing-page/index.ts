import axios from "@/config/axios";
import { landingPageContent } from "@/config/landing-page";

async function fetchLandingPageContent() {
    try {
        const response = await axios.get("/content/landing-page");

        if (!response.data || response.status != 200) return { data: landingPageContent };
        return response.data;
    } catch (error) {
        /* 
        ** log error to sentry or any other error tracking service
        ** send default content to the user if the request fails, dont break the app
        */

        return landingPageContent;
    }
}

export const landingPageAction = {
    fetchLandingPageContent,
};
