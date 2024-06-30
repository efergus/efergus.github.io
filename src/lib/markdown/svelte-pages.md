# SvelteKit

```sh
npm create svelte@latest
```

Also ensure `.svelte-kit` is added to `.gitignore`

## Static Adapter

```sh
npm i -D @sveltejs/adapter-static
```

## Modify svelte.config.js

```js
import adapter from "@sveltejs/adapter-static";
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

```js
export const prerender = true;
```

# If using tailwind:

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
  preprocess: vitePreprocess(),
};
```

## Add app.css:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Add +layout.svelte:

```svelte
<script>
  import "../app.css";
</script>

<slot />
```

## Add to style tags:

```html
<style lang="postcss">
```

# Using colors w/ tailwind

## tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,svelte}"],
  theme: {
    extend: {
      strokeWidth: {
        3: "3px",
      },
    },

    colors: {
      primary: "rgb(var(--color-primary) / <alpha-value>)",
      secondary: "rgb(var(--color-secondary) / <alpha-value>)",
      contrast: "rgb(var(--color-contrast) / <alpha-value>)",
      "contrast-secondary":
        "rgb(var(--color-contrast-secondary) / <alpha-value>)",
      theme: "rgb(var(--color-theme) / <alpha-value>)",
      white: "#ffffff",
      black: "#000000",
    },
  },
  plugins: [],
};
```

# Add .github/workflows/deploy.yml

```
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
