<script lang="ts">
  import hljs from "highlight.js";

  interface Props {
    source: string;
    lang: string;
  }

  let { source, lang }: Props = $props();
</script>

<pre><code class="hljs"
    >{@html hljs.highlight(source, { language: lang }).value}</code
  ></pre>
