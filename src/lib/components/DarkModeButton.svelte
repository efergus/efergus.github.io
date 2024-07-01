<script>
  import Moon from "$lib/icons/Moon.svelte";

  export let checked = false;
</script>

<label
  class="fill-contrast stroke-contrast hover:bg-secondary h-fit p-1 rounded-lg cursor-pointer"
>
  <input type="checkbox" class="hidden dark-mode-toggle" bind:checked />
  <Moon />
</label>
