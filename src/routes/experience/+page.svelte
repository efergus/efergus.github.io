<script lang="ts">
  import Markdown from "$lib/markdown/Markdown.svelte";
  import source from "$lib/markdown/experience.md?raw";
</script>

<svelte:head>
  <title>Experience</title>
</svelte:head>

<div class="text-lg max-w-4xl markdown experience">
  <Markdown {source} raw />
</div>

<style lang="postcss">
  .markdown.experience > :global(h2) {
    @apply pb-0.5 border-b-4 border-b-highlight;
  }
</style>
