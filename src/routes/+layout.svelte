<script>
  import "../app.css";
  import "../style.css";
  import "$lib/markdown/markdown.css";
  import NavLink from "$lib/components/NavLink.svelte";
  import PageMenu from "$lib/components/PageMenu.svelte";
</script>

<svelte:head>
  <title>Ethan Ferguson</title>
</svelte:head>

<div class="bg-theme w-full h-screen flex flex-col overflow-auto absolute">
  <header class="bg-primary p-4 z-50 hidden md:block">
    <div>
      <h1>Ethan Ferguson</h1>
    </div>
  </header>
  <div class="sticky top-0 bg-secondary w-full z-40">
    <PageMenu>
      <h2 slot="title">Ethan Ferguson</h2>
      <div
        class="bg-secondary flex flex-col md:flex-row flex-wrap px-8 pt-2 pb-3 gap-4"
      >
        <NavLink href="/">Home</NavLink>
        <NavLink href="/experience">Experience</NavLink>
        <NavLink href="/projects">Projects</NavLink>
        <NavLink href="/photography">Photography</NavLink>
        <NavLink href="/art">Art</NavLink>
      </div>
    </PageMenu>
  </div>
  <div class="w-full grow flex flex-col justify-center p-4">
    <div class="grow-[1]" />
    <div class="grow-[4] flex justify-center">
      <div class="max-w-full">
        <slot />
      </div>
    </div>

    <div class="grow-[6]" />
  </div>
</div>
