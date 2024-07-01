<script lang="ts">
  import { page } from "$app/stores";
  export let href: string;

  $: path = $page.url.pathname;
</script>

<a
  {href}
  class="text-xl font-bold border-b-4 border-b-primary hover:text-highlight hover:border-b-highlight"
  class:active={href === "/" ? href === path : path.startsWith(href)}
  ><slot /></a
>

<style lang="postcss">
  .active {
    @apply border-b-contrast-secondary;
  }
</style>
