<script lang="ts">
  import { Marked } from "marked";
  import { markedHighlight } from "marked-highlight";
  import hljs from "highlight.js";
  import { onMount } from "svelte";

  interface MarkdownProps {
    source: string;
    raw?: boolean;
  }

  let { source, raw, ...rest }: MarkdownProps = $props();

  const languages = new Map([
    ["html", "xml"],
    ["sh", "bash"],
    ["svelte", "js"],
  ]);

  const marked = new Marked(
    markedHighlight({
      emptyLangClass: "hljs",
      langPrefix: "hljs language-",
      highlight(text, lang) {
        if (!lang) {
          return hljs.highlightAuto(text).value;
        }
        const language = languages.get(lang) || lang;
        return hljs.highlight(text, { language }).value;
      },
    }),
  );
</script>

{#if raw}
  {@html marked.parse(source, { async: false })}
{:else}
  <div class="markdown" {...rest}>
    {@html marked.parse(source, { async: false })}
  </div>
{/if}
