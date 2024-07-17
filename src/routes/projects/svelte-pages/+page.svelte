<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";
  import source from "$lib/markdown/svelte-pages.md?raw";
  import CodeRenderer from "$lib/components/renderers/CodeRenderer.svelte";
</script>

<svelte:head>
  <title>Svelte on Pages</title>
</svelte:head>

<div class="text-lg max-w-4xl markdown">
  <SvelteMarkdown {source} renderers={{ code: CodeRenderer }} />
</div>
