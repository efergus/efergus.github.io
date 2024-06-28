<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";
  import source from "$lib/markdown/experience.md?raw";
</script>

<svelte:head>
  <title>Experience</title>
</svelte:head>

<div class="text-lg max-w-4xl markdown">
  <SvelteMarkdown {source} />
</div>
