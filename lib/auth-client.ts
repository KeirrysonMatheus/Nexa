import { createAuthClient } from "better-auth/react"; 
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

const configuredUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_URL;

const fallbackUrl = "https://app-nexa-social.vercel.app";

const appUrl = (() => {
    const url = configuredUrl?.trim();
    if (!url) return fallbackUrl;

    try {
        const parsedUrl = new URL(url);
        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
            return fallbackUrl;
        }
        return parsedUrl.origin;
    } catch {
        return fallbackUrl;
    }
})();

export const authClient = createAuthClient({
    baseURL: appUrl,
    plugins: [
        inferAdditionalFields<typeof auth>()
    ],
});
