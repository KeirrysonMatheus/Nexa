# Next.js template

This is a Next.js template with shadcn/ui.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button";
```

## Environment variables

Set the database and application URL variables required by the local setup. Google login is enabled when both values below are present:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

For Google OAuth, use the callback URL `/api/auth/callback/google` on the same origin as the app.
