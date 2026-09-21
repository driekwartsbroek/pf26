import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// SITE and BASE are injected by the GitHub Pages workflow, so the same
// config works for username.github.io, a project repo, or a custom domain.
export default defineConfig({
  site: process.env.SITE || 'http://localhost:4321',
  base: process.env.BASE || '/',
  trailingSlash: 'ignore',
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
  integrations: [sitemap()],
});