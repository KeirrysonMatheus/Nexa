import { createAuthClient } from "better-auth/react"; 
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "./auth";

const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_URL ||
    "https://app-nexa-social.vercel.app";

export const authClient = createAuthClient({
    baseURL: appUrl,
    plugins: [
        inferAdditionalFields<typeof auth>()
    ],
});
