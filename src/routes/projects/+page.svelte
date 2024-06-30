<script>
  import Project from "$lib/components/Card.svelte";
  import molecule from "$lib/assets/particlegrid/mol-representations.png";
</script>

<h1 class="emphasize">Projects and Writeups</h1>

<div id="grid" class="max-w-[80vw]">
  <Project
    title="Fermidle"
    subtitle="why do they call them dle's when they're anything but?"
    link="https://eferg.us/fermidle"
  >
    <div>
      <p>How many golf balls would it take to fill the oceans?</p>
      <p>
        How many Empire State Buildings would it take to reach the altitude of
        the ISS?
      </p>
    </div>
  </Project>
  <Project
    title="WebGPU-Spy"
    subtitle="Paper: A hardware-based microarchitectural attack"
    link="https://arxiv.org/pdf/2401.04349"
  >
    <p>
      WebGPU-Spy is a hardware-based michroarchitectural attack that takes
      advantage of the low-level nature of the WebGPU API. It uses a cache
      occupancy channel to determine which website the victim is using.
    </p>
    <p></p>
  </Project>
  <Project
    title="ParticleGrid"
    subtitle="Paper: Enabling Deep Learning using 3D
    Representation of Materials"
    link="https://arxiv.org/pdf/2211.08506"
  >
    <p>
      ParticleGrid is a project to enable Deep Learning on Molecule datasets by
      leveraging the power of convolutional networks for the purpose of
      drug/material discovery. Convolutional neural networks are behind nearly
      all of the biggest advancements in image processing, and have potential to
      do the same for molecules.
    </p>
    <p>
      The idea is to take a SMILES string, which is a textual representation of
      a molecule, and turn it into a 3D grid of atom densities. Using existing
      state-of-the-art convolutional techniques on such a grid is then very
      straightforwad. In order to facilitate maximum efficiency for property
      prediction, I worked to enhance the performance of this process
      considerably. I was able to achieve a best-case speedup of 100,000x over
      my colleague's initial numpy implementation.
    </p>
    <p>
      The overall process is is to go from SMILES string <i>(a)</i> to 3D grid
      <i>(f)</i>. For more info, take a look at the paper! We were able to
      generate these grids, and then create a model using Pytorch to predict the
      homo-lumo gap of a material.
    </p>
    <img src={molecule} alt="The principle of ParticleGrid" />
  </Project>
  <Project
    title="Static Svlete on GitHub Pages"
    subtitle="Writeup"
    link="/projects/svelte-pages"
  >
    <p>
      Svelte is awesome, and it's how I created this website. This is a writeup
      on how I got Svelte/SvelteKit working on GitHub pages. Turns out it's very
      easy to do! I wanted a quick guide that shows all the steps without too
      much fluff, so that's what this is.
    </p>
  </Project>
  <!-- TODO: link -->
  <Project title="No-JS dark mode toggle" subtitle="Writeup" link="">
    <p>
      Everyone knows dark mode is best. Or something. But what if... you had the
      option to choose? Well, some brilliant people have decided to make that
      dream a reality, and I decided to try doing it using only CSS, without
      using any JS.
    </p>
  </Project>
  <!-- TODO: link -->
  <Project title="No-JS mobile menu" subtitle="Writeup" link="">
    <p>
      Mobile pop-out menus are super nice, but you'd expect to need JS for
      something that complex. But what if... you didn't? Similarly to my no-JS
      dark mode, I made a mobile menu that doesn't need any JS to function, and
      it even has a fancy animation! It doesn't even use <code>calc()</code>!
    </p>
  </Project>
  <Project
    title="Basic Backprop"
    subtitle="Numpy-based machine learning"
    link="https://github.com/efergus/basic-backprop"
  >
    <p>
      I wanted to understand how backpropagation works, so I built a
      backpropagation algorithm in python using numpy. It's not exactly
      high-speed.
    </p>
  </Project>
  <Project
    title="Burnt Umber"
    subtitle="3D Color picker"
    link="https://github.com/efergus/burnt-umber"
  >
    <p>
      There's a lot of color pickers out there, but this one is mine. I love
      color science, and I think we need more perceptually uniform color pickers
      in our lives. I'm especially interested in making something that shows you
      what's going on with different color spaces, so that's what this is. 3D
      representations of color spaces that function as color pickers, hopefully
      even useful ones! It's still a WIP, but here's a link to the <a
        href="https://github.com/efergus/burnt-umber">GitHub page</a
      >
    </p>
  </Project>
  <!-- TODO <Project
    title="Image Gallery"
  >
  </Project> -->
</div>

<style lang="postcss">
  div#grid {
    gap: 1em;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(90vw, 24rem), 1fr));
    grid-auto-rows: 24rem;
  }
</style>
