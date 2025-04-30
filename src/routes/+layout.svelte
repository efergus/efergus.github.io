<script lang="ts">
  import "../app.css";
  import "../style.css";
  import "highlight.js/styles/atom-one-dark.css";
  import "$lib/markdown/markdown.css";
  import NavLink from "$lib/components/NavLink.svelte";
  import PageMenu from "$lib/components/PageMenu.svelte";
  import DarkModeButton from "$lib/components/DarkModeButton.svelte";
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();

  let invert = $state(false);
</script>

<svelte:head>
  <title>Ethan Ferguson</title>
</svelte:head>

<div class="w-full h-screen flex flex-col overflow-auto absolute">
  <header
    class="theme-focus bg-primary p-1 z-50 hidden md:flex justify-between"
  >
    <h1 class="p-3 font-serif">Ethan Ferguson</h1>
    <DarkModeButton bind:checked={invert} color="white" />
  </header>
  <div class="theme-focus sticky top-0 bg-secondary w-full z-40">
    <PageMenu>
      {#snippet title()}
        <h2>Ethan Ferguson</h2>
      {/snippet}
      <div
        class="bg-secondary flex flex-col md:flex-row flex-wrap px-8 pt-2 pb-3 gap-4"
      >
        <NavLink href="/">Home</NavLink>
        <NavLink href="/experience">Experience</NavLink>
        <NavLink href="/projects">Projects</NavLink>
        <NavLink href="/photography">Photography</NavLink>
        <NavLink href="/art">Art</NavLink>
        <div class="flex justify-end items-center gap-2 md:hidden">
          <DarkModeButton bind:checked={invert} color="white" />
        </div>
      </div>
    </PageMenu>
  </div>
  <div class="w-full grow flex flex-col justify-center px-4 py-8">
    <div class="grow-[1]"></div>
    <div class="grow-[4] flex justify-center">
      <div class="max-w-full">
        {@render children?.()}
      </div>
    </div>

    <div class="grow-[6]"></div>
  </div>
</div>
