<script lang="ts">
  import Highlight from "svelte-highlight";
  import atom from "svelte-highlight/styles/atom-one-dark";

  export let source: string;
  export let lang: any;
</script>

<svelte:head>
  {@html atom}
</svelte:head>

<Highlight language={lang} code={source} />
