<script lang="ts">
  import Moon from "$lib/icons/Moon.svelte";
  import clsx from "clsx";

  export let checked = false;
  export let color: "white" | "black" | undefined = undefined;
  let colorClass = "";
  $: {
    colorClass = "fill-contrast stroke-contrast";
    if (color === "white") {
      colorClass = "fill-white stroke-white";
    } else if (color === "black") {
      colorClass = "fill-black stroke-black";
    }
  }
</script>

<label
  class={clsx(
    colorClass,
    "hover:bg-secondary h-fit p-1 rounded-lg cursor-pointer"
  )}
>
  <input type="checkbox" class="hidden dark-mode-toggle" bind:checked />
  <Moon />
</label>
