<script>
  import clsx from "clsx";

  export let open = false;
  export let duration = 0.15;
  export let adaptive = true;
</script>

<div class={clsx("relative flex w-full", adaptive && "md:justify-start")}>
  <label
    class={clsx(
      "flex justify-stretch items-center w-full menu place-self-end z-10",
      adaptive && "md:hidden",
      { open }
    )}
  >
    <div class="title transition-opacity opacity-100 flex items-center grow">
      <slot name="title" />
    </div>
    <input type="checkbox" class="menu hidden" bind:checked={open} />
    <svg
      style="--duration:{duration}"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="-12 -12 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-menu"
    >
      <line class="line1" x1="-9" y1="0" x2="9" y2="0" />
      <line class="line2" x1="-9" y1="0" x2="9" y2="0" />
      <line class="line3" x1="-9" y1="0" x2="9" y2="0" />
    </svg>
  </label>
  <div
    class={clsx(
      "menu-parent absolute w-full overflow-hidden pointer-events-none z-20",
      {
        adaptive,
      }
    )}
  >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class={clsx("menu pointer-events-auto", { adaptive })}
      on:click={() => {
        open = false;
      }}
    >
      <slot />
    </div>
  </div>
</div>

<style lang="postcss">
  div.menu {
    @apply transition-transform -translate-y-full w-full max-h-screen overflow-auto;
  }
  @media screen(md) {
    div.menu.adaptive {
      transform: translateY(0px);
      position: static;
    }
    div.menu-parent.adaptive {
      position: static;
    }
  }

  label.menu:has(input.menu:checked) ~ div > div.menu,
  label.menu.open ~ div > div.menu {
    transform: translateY(0);
  }

  label.menu:has(input.menu:checked) .title,
  label.menu.open .title {
    opacity: 0;
  }

  label.menu {
    @apply p-2 z-10;
  }
  line {
    transition-property: transform;
    transition-duration: calc(var(--duration) * 1s);
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  .line1 {
    transform: translateY(30%);
  }
  .line2 {
    transform: scaleX(1);
  }
  .line3 {
    transform: translateY(-30%);
  }
  input.menu:checked ~ svg > line.line1,
  .open line.line1 {
    transform: translateY(0) rotate(-45deg);
  }

  input.menu:checked ~ svg > line.line2,
  .open line.line2 {
    transform: scaleX(0);
  }

  input.menu:checked ~ svg > line.line3,
  .open line.line3 {
    transform: translateY(0) rotate(45deg);
  }
</style>
