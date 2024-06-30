<script lang="ts">
  import Gallery from "$lib/components/Gallery.svelte";

  import ear from "$lib/assets/art/Ear.jpg";
  import ear2 from "$lib/assets/art/Ear2.jpg";
  import hand from "$lib/assets/art/Hand.jpg";
  import nose from "$lib/assets/art/Nose.jpg";
  import nose2 from "$lib/assets/art/Nose2.jpg";
  import tie from "$lib/assets/art/Tie.jpg";
  import mail from "$lib/assets/art/Mail.jpg";
  import liberty from "$lib/assets/art/Liberty.jpg";
  import parts from "$lib/assets/art/Parts.jpg";

  const images = [
    {
      src: ear,
    },
    {
      src: nose,
    },
    {
      src: hand,
    },
    {
      src: ear2,
      shape: "portrait",
    },
    {
      src: nose2,
      shape: "portrait",
    },
    {
      src: tie,
    },
    {
      src: mail,
      shape: "portrait",
    },
    {
      src: liberty,
    },
    {
      src: parts,
    },
  ];
</script>

<svelte:head>
  <title>Art</title>
</svelte:head>

<div class="p-10 pb-16">
  <h2 class="border-b-2 border-b-highlight max-w-lg">
    Here is some of my art:
  </h2>
</div>

<div class="flex w-full justify-center">
  <Gallery {images} />
</div>

<style>
</style>
