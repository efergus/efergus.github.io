<script>
  import clsx from "clsx";

  export let duration = 0.15;
  export let adaptive = true;
</script>

<label class={clsx({ adaptive })}>
  <input type="checkbox" class="menu hidden" />
  <div class="bar">
    <div class="title">
      <slot name="title" />
    </div>
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
      class="z-10"
    >
      <line class="line1" x1="-9" y1="0" x2="9" y2="0" />
      <line class="line2" x1="-9" y1="0" x2="9" y2="0" />
      <line class="line3" x1="-9" y1="0" x2="9" y2="0" />
    </svg>
  </div>

  <div
    class={clsx("clip", {
      adaptive,
    })}
  >
    <div class="menu">
      <slot />
    </div>
  </div>
</label>

<style lang="postcss">
  /* state */
  label {
    @apply w-full relative;
  }
  label input:checked ~ div > div.menu {
    transform: translateY(0);
  }
  input.menu:checked ~ .title {
    opacity: 0;
  }

  div.title {
    @apply transition-opacity opacity-100 flex items-center grow;
  }
  div.menu {
    @apply transition-transform -translate-y-full overflow-auto pointer-events-auto w-full max-h-screen;
  }
  div.bar {
    @apply flex justify-stretch items-center p-2 w-full;
  }
  div.clip {
    @apply absolute top-0 overflow-hidden pointer-events-none w-full;
  }
  @media screen(md) {
    .adaptive div.bar {
      display: none;
    }
    .adaptive div.menu {
      transform: translateY(0px);
      position: static;
    }
    .adaptive div.clip {
      position: static;
    }
  }

  /* button animation */
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
  input.menu:checked ~ div line.line1 {
    transform: translateY(0) rotate(-45deg);
  }

  input.menu:checked ~ div line.line2 {
    transform: scaleX(0);
  }

  input.menu:checked ~ div line.line3 {
    transform: translateY(0) rotate(45deg);
  }
</style>
