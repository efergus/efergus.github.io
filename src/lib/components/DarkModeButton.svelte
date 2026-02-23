<script lang="ts">
  import { run } from "svelte/legacy";

  import Moon from "$lib/icons/Moon.svelte";
  import clsx from "clsx";

  interface Props {
    checked?: boolean;
    color?: "white" | "black" | undefined;
  }

  let { checked = $bindable(false), color = undefined }: Props = $props();
  let colorClass = $derived.by(() => {
    if (color === "white") {
      return "fill-white stroke-white";
    } else if (color === "black") {
      return "fill-black stroke-black";
    }
    return "fill-contrast stroke-contrast";
  });
</script>

<label
  class={clsx(
    colorClass,
    "hover:bg-secondary h-fit p-1 rounded-lg cursor-pointer",
  )}
>
  <input type="checkbox" class="hidden dark-mode-toggle" bind:checked />
  <Moon />
</label>
