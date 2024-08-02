<script lang="ts">
  import ExternalLink from "$lib/icons/external-link.svelte";
  import clsx from "clsx";
  import ConditionalLink from "./ConditionalLink.svelte";

  export let title: string = "";
  export let subtitle: string = "";
  export let link = "";
  export let scroll = true;
</script>

<ConditionalLink {link} external={true}>
  <div
    class="flex flex-col border rounded-lg shadow px-4 py-2 h-full w-full gap-2"
  >
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
    <div
      class={clsx(
        "flex flex-col justify-start gap-3",
        scroll ? "overflow-auto" : "overflow-visible"
      )}
    >
      <slot />
    </div>
  </div>
</ConditionalLink>
