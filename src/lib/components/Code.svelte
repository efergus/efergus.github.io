<script lang="ts">
  import Highlight from "svelte-highlight";
  import atom from "svelte-highlight/styles/atom-one-dark";
  import js from "svelte-highlight/languages/javascript";
  import xml from "svelte-highlight/languages/xml";
  import css from "svelte-highlight/languages/css";

  export let source: string;
  export let lang: "css" | "js" | "xml";

  const language = { css, js, xml }[lang];
</script>

<svelte:head>
  {@html atom}
</svelte:head>

<Highlight {language} code={source} />
