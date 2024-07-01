<script lang="ts">
  import SvelteMarkdown from "svelte-markdown";
  import hljs from "highlight.js";
  import { onMount } from "svelte";

  export let source: string;

  onMount(() => {
    hljs.highlightAll();
  });
</script>

<div class="markdown">
  <SvelteMarkdown {source} />
</div>
