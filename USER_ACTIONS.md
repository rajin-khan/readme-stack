# Rajin's action queue

## Current step: create the GitHub repository

The local build is ready. It is time to create the public repository:

1. Open <https://github.com/new>.
2. Set the repository name to `stack-marquee`.
3. Set it to **Public**.
4. Leave **Add a README**, **Add .gitignore**, and **Choose a license** off. Those files already exist here.
5. Create the repository.
6. Send Codex the repository URL.

Do not create the Cloudflare Worker, project, custom domain, database, storage bucket, Vercel project, or DNS record yet. Codex will prepare and push the local repository first.

## After the repository is pushed

Rajin will then:

1. Open Cloudflare Workers and Pages and connect the repository.
2. Use `pnpm build` as the build command. The Worker with Static Assets configuration is already in `wrangler.jsonc`.
3. Add `stack.rajinkhan.com` as the custom domain.
4. Confirm that the deployment shows a successful `/v1/health` response.

Do not perform these Cloudflare steps yet. Codex will give the exact screen flow after the repository is pushed.
