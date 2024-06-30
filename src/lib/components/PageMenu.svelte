<script>
  import clsx from "clsx";

  export let open = false;
  export let duration = 0.15;
</script>

<div class="relative flex justify-end md:justify-start w-full">
  <label class={clsx("menu md:hidden place-self-end", { open })}>
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
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="menu"
    on:click={() => {
      open = false;
    }}
  >
    <slot />
  </div>
</div>

<style lang="postcss">
  div.menu {
    @apply absolute transition-transform -translate-y-full w-full;
  }
  @media screen(md) {
    div.menu {
      transform: translateY(0px);
      position: static;
    }
  }

  label.menu:has(input.menu:checked) ~ div.menu,
  label.menu.open ~ div.menu {
    transform: translateY(0);
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
