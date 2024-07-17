<script lang="ts">
  import Highlight from "svelte-highlight";
  import atom from "svelte-highlight/styles/atom-one-dark";
  import js from "svelte-highlight/languages/javascript";
  import xml from "svelte-highlight/languages/xml";
  import css from "svelte-highlight/languages/css";
  import bash from "svelte-highlight/languages/bash";
  import yaml from "svelte-highlight/languages/yaml";

  const languages = {
    css,
    js,
    xml,
    html: xml,
    bash,
    sh: bash,
    yaml,
    svelte: js,
  };

  export let source: string;
  export let lang: keyof typeof languages;

  const language = languages[lang];

  console.log({ lang });
</script>

<svelte:head>
  {@html atom}
</svelte:head>

<Highlight {language} code={source} />
