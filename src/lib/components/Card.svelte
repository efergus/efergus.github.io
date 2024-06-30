<script lang="ts">
  import ExternalLink from "$lib/icons/external-link.svelte";
  import ConditionalLink from "./ConditionalLink.svelte";

  export let title: string;
  export let subtitle: string = "";
  export let link = "";
</script>

<ConditionalLink {link}>
  <div class="flex flex-col border rounded-lg shadow px-4 py-2 h-full w-full">
    <div class="flex justify-between">
      <h2>{title}</h2>
      {#if link}
        <ExternalLink />
      {/if}
    </div>
    {#if subtitle}
      <p class="text-contrast/60 pb-2">{subtitle}</p>
    {/if}
    <div class="flex flex-col justify-start gap-3 overflow-auto">
      <slot />
    </div>
  </div>
</ConditionalLink>
