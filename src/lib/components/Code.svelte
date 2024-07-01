<script lang="ts">
  export let source = "";
  export let lang = "";
</script>

<pre><code class={lang ? `language-${lang}` : ""}>{source}</code></pre>
