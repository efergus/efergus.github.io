<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";
  import source from "$lib/markdown/experience.md?raw";
</script>

<svelte:head>
  <title>Experience</title>
</svelte:head>

<div class="text-lg max-w-4xl markdown experience">
  <SvelteMarkdown {source} />
</div>

<style lang="postcss">
  .markdown.experience > :global(h2) {
    @apply pb-0.5 border-b-2 border-b-highlight;
  }
</style>
