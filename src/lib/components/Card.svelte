<script lang="ts">
  import ExternalLink from "$lib/icons/external-link.svelte";
  import clsx from "clsx";
  import ConditionalLink from "./Link.svelte";
  import type { Snippet } from "svelte";

  interface Props {
    title?: string;
    subtitle?: string;
    link?: string;
    scroll?: boolean;
    children?: Snippet;
  }

  let {
    title = "",
    subtitle = "",
    link = "",
    scroll = true,
    children,
  }: Props = $props();
</script>

<div
  class="flex flex-col border rounded-lg shadow px-4 py-2 h-full w-full gap-2"
>
  <ConditionalLink {link} external>
    {#if title || link || subtitle}
      <div>
        <div class="flex justify-between">
          <h2>{title}</h2>
          {#if link}
            <ExternalLink />
          {/if}
        </div>
        {#if subtitle}
          <p class="text-contrast/60 pb-2">{subtitle}</p>
        {/if}
      </div>
    {/if}
  </ConditionalLink>
  <div
    class={clsx(
      "flex flex-col justify-start gap-3",
      scroll ? "overflow-auto" : "overflow-visible",
    )}
  >
    {@render children?.()}
  </div>
</div>
