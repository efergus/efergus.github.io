<script lang="ts">
  import Code from "../Code.svelte";

  let { lang, text } = $props();
</script>

<Code {lang} source={text} />
