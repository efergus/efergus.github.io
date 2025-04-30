<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    link?: string | undefined;
    external?: boolean;
    children?: Snippet;
  }

  let { link = undefined, external = false, children }: Props = $props();
</script>

{#if link}
  <div>
    <a href={link} target={external ? "_blank" : ""}>{@render children?.()}</a>
  </div>
{:else}
  {@render children?.()}
{/if}
