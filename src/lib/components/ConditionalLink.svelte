<script lang="ts">
  export let link: string | undefined = undefined;
  export let external = false;
</script>

{#if link}
  <a href={link} target={external ? "_blank" : ""}><slot /></a>
{:else}
  <slot />
{/if}
