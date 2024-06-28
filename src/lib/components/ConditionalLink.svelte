<script lang="ts">
  export let link: string | undefined = undefined;
</script>

{#if link}
  <a href={link}><slot /></a>
{:else}
  <slot />
{/if}
