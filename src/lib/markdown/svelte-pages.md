# SvelteKit

Initialize a directory with `SvelteKit`

```sh
npm create svelte@latest
```

Also ensure `.svelte-kit` is added to your `.gitignore` if using git

## Static Adapter

Also install the staic adapter, which enables building the static site GitHub pages needs

```sh
npm i -D @sveltejs/adapter-static
```

## Modify svelte.config.js

Add the static adapter to `svelte.config.js` and set the options for the adapter

```js
import adapter from "@sveltejs/adapter-static"; // <- this is the important bit
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter({
      pages: "build",
      assets: "build",
      fallback: "404.html",
      precompress: false,
      strict: true,
    }),
  },
};

export default config;
```

## Add +layout.js

This is necessary to get the static site generation to work properly:

```js
// +layout.js
export const prerender = true;
```

# If using tailwind:

I like using tailwind, and the steps to get it set up can be non-obvious:

## Install tailwind & friends

```sh
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

## Ensure you are using vite preprocessor

```js
import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
/** @type {import('@sveltejs/kit').Config} */
export default {
  kit: {
    adapter: adapter(),
  },
  preprocess: vitePreprocess(), // <- this guy
};
```

## Add app.css:

```css
/* app.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Add +layout.svelte:

In `+layout.svelte`:
```svelte
<script>
  import "../app.css";
</script>

<slot />
```

## Add to style tags:

Add this to any style tags if you want to use tailwind constructs like `@apply`:
```html
<style lang="postcss">
```

# Add .github/workflows/deploy.yml

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: 'main'

jobs:
  build_site:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      # If you're using pnpm, add this step then change the commands and cache key below to use `pnpm`
      # - name: Install pnpm
      #   uses: pnpm/action-setup@v3
      #   with:
      #     version: 8

      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm install

      - name: build
        env:
          BASE_PATH: '/'
        run: |
          npm run build

      - name: Upload Artifacts
        uses: actions/upload-pages-artifact@v2
        with:
          path: 'build/'

  deploy:
    needs: build_site
    runs-on: ubuntu-latest

    permissions:
      pages: write
      id-token: write

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v4
```
