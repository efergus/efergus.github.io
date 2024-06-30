<script lang="ts">
  import clsx from "clsx";
  import { list } from "postcss";
  import { onMount } from "svelte";
  type Selected = {
    index: number;
    position: {
      x: number;
      y: number;
      scale: number;
    };
  };

  export let images: {
    src: string;
    alt?: string;
    shape?: "portrait" | "square" | string;
  }[] = [];

  let selected: Selected | null = null;

  const onClick = (index: number) => (event: MouseEvent) => {
    if (index === selected?.index) {
      selected = null;
      return;
    }
    event.stopPropagation();
    const elem = event.target as HTMLButtonElement;
    const rect = elem?.getBoundingClientRect();
    const screen = {
      x: window.innerWidth,
      y: window.innerHeight,
    };
    const scale = Math.min(screen.x / rect.width, screen.y / rect.height) * 0.8;
    if (scale <= 1) {
      return;
    }
    const position = {
      x: screen.x / 2 - (rect.x + rect.width / 2),
      y: screen.y / 2 - (rect.y + rect.height / 2),
      scale,
    };
    selected = {
      index,
      position,
    };
  };

  const getStyle = (selected: Selected) => {
    const { position } = selected;
    const style = `transform: translate(${position.x}px, ${position.y}px) scale(${position.scale}); z-index: 20;`;
    console.log({ style });
    return style;
  };

  const listener = () => {
    selected = null;
  };

  onMount(() => {
    document.addEventListener("click", listener);
    return () => {
      document.removeEventListener("click", listener);
    };
  });
</script>

<div>
  {#each images as image, idx}
    <button
      class="transition-transform drop-shadow lg:hover:scale-105 hover:z-10"
      on:click={onClick(idx)}
      style={idx === selected?.index ? getStyle(selected) : ""}
    >
      <img
        src={image.src}
        alt={image.alt}
        class={clsx("transition-transform", image.shape)}
      />
    </button>
  {/each}
</div>

<style lang="postcss">
  div {
    @apply flex flex-wrap justify-center gap-4;
  }

  img {
    flex: 1 1 1;
    object-fit: cover;
    max-width: 36rem;
    max-height: 24rem;
    width: 100%;
    aspect-ratio: 1.5;
    @apply rounded;
  }

  img.portrait {
    aspect-ratio: auto;
    max-width: 18rem;
  }

  img.square {
    aspect-ratio: 1;
    max-width: 24rem;
  }
</style>
