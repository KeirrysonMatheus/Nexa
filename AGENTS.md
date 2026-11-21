<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## GitHub Flow and Environment Promotion

Use GitHub Flow for every request:

1. Create a dedicated short-lived branch from `staging`.
2. Implement the correction or feature on that branch and add focused validation.
3. Open a pull request targeting `staging`, validate the change in the staging environment, and merge it only after testing passes.
4. Open a pull request from `staging` to `main` (production) only after the staging deployment has been validated.
5. Merge to `main` and verify the production deployment.
6. Delete the completed feature branch after it is merged.

Never merge a correction or feature directly into `main`. All changes must pass through `staging` first.

## Give max priority for security of the system