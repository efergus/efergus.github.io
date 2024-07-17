<script>
  import Code from "../Code.svelte";

  export let lang;
  export let text;
</script>

<Code {lang} source={text} />
