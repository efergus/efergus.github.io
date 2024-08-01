<script lang="ts">
  import moss from "$lib/assets/photography/colorful_moss.jpg";
  import ina from "$lib/assets/photography/ina.jpg";
  import fence from "$lib/assets/photography/fence.jpg";
  import grass from "$lib/assets/photography/grass.jpg";
  import weird_plant from "$lib/assets/photography/weird_plant.jpg";
  import bud from "$lib/assets/photography/bud.jpg";
  import weed from "$lib/assets/photography/weed.jpg";
  import bee_zooming from "$lib/assets/photography/bee_zooming.jpg";
  import tiny_planet from "$lib/assets/photography/tiny_planet.jpg";
  import bee from "$lib/assets/photography/bee.jpg";
  import carmey from "$lib/assets/photography/carmey.jpg";
  import bee_close from "$lib/assets/photography/bee_close.jpg";
  import flower from "$lib/assets/photography/flower.jpg";
  import purple_flower from "$lib/assets/photography/purple_flower.jpg";
  import dice from "$lib/assets/photography/dice.jpg";
  import blade_on_zero from "$lib/assets/photography/blade_on_zero.jpg";
  import yellow_flower from "$lib/assets/photography/yellow_flower.jpg";
  import spider from "$lib/assets/photography/spider.jpg";
  import philmont_vista from "$lib/assets/photography/philmont_vista.jpg";
  import ball_catch from "$lib/assets/photography/ball_catch.jpg";
  import Gallery from "$lib/components/Gallery.svelte";

  const landscape = [
    moss,
    ina,
    fence,
    bee_zooming,
    bee_close,
    bee,
    grass,
    weird_plant,
    bud,
    weed,
    carmey,
    flower,
    purple_flower,
    dice,
    blade_on_zero,
    yellow_flower,
    spider,
    philmont_vista,
  ];
  const square = [tiny_planet];
  const portrait = [ball_catch];
  const images = landscape
    .map((src) => ({ src }))
    .concat(square.map((src) => ({ src, shape: "square" })))
    .concat(portrait.map((src) => ({ src, shape: "portrait" })));
</script>

<svelte:head>
  <title>Experience</title>
</svelte:head>

<div class="p-10 pb-16">
  <h2 class="border-b-4 border-b-highlight max-w-lg">
    Here is some of my photography:
  </h2>
</div>

<div class="flex w-full justify-center">
  <Gallery {images} />
</div>

<style>
</style>
