<script lang="ts">
  import linkedin from "$lib/assets/In-Blue-48.png";
  import personality from "$lib/assets/Personality.jpg";
</script>

<div class="flex flex-col gap-2 h-full max-w-4xl text-lg">
  <div class="flex justify-between items-center emphasize pb-1">
    <h1>About Me</h1>
    <a href="https://www.linkedin.com/in/ethan-ferguson-112011193/"
      ><img src={personality} alt="Me" class="w-12 h-12 rounded-full" /></a
    >
  </div>
  <p>
    I'm a Software Engineer at Jahnel Group. I studied CS and Cybersecurity at
    Binghamton University. I have published and presented at ACM (Association
    for Computing Machinery) and IEEE (Institute of Electrical and Electronics
    Engineers) conferences. I have a love for exploration and discovery that
    thrives in both the information-rich world of technology and the great
    outdoors.
  </p>
  <p>
    I currently develop full-stack applications with Jahnel Group, tackling the
    hardest problems they have to throw at me. I worked as an intern with
    Grammatech developing software for binary analysis and identification. I
    have worked with Sonnet Software optimizing their code for MacOS and the
    M-series ARM chips, and revitalized their legacy MATLAB interface.
  </p>
  <p>
    I've done research with professors Kenneth Chiu and Hoda Naghibijouybari at
    Binghamton University, devloping remote microarchitectural side channel
    attacks using the WebGPU framework with Professor Naghibijouybari and
    building the ParticleGrid project for novel drug generation with Professor
    Chiu. Through exploring different focuses in college I've found any
    technical challenge interests me, and I'm ready to take on anything you can
    throw at me.
  </p>
  <p>
    I have risen through the ranks of scouting all the way to the highest rank
    of Eagle, and along the way learned valuable lessons about leadership and
    project management. Exploration has also driven creative projects, such as
    art and photography. If you've got something cool for me to do, let's
    connect.
  </p>
  <a
    href="https://www.linkedin.com/in/ethan-ferguson-112011193/"
    target="_blank"
    class="self-end"
  >
    <img
      src={linkedin}
      alt="LinkedIn Logo"
      class="h-12 w-12 border-transparent hover:border-highlight border rounded"
    />
  </a>
</div>
