<script lang="ts">
  import linkedin from "$lib/assets/In-Blue-48.png";
  import personality from "$lib/assets/Personality.jpg";
  import CheckIcon from "$lib/icons/CheckIcon.svelte";
  import CopyIcon from "$lib/icons/CopyIcon.svelte";
  import MailIcon from "$lib/icons/MailIcon.svelte";
  import clsx from "clsx";

  const email_domain = "gmail.com";
  const email_user = "ethanmferguson";
  let email = email_domain + email_user;
  $: email_ready = email.includes("@");
  $: copied = false;

  const getEmail = () => {
    email = [email_user, email_domain].join("@");
    return email;
  };
</script>

<div class="flex flex-col gap-2 h-full max-w-4xl text-lg">
  <div class="flex justify-between items-center emphasize pb-1">
    <h1>About Me</h1>
    <a href="https://www.linkedin.com/in/ethan-ferguson-112011193/">
      <img src={personality} alt="Me" class="w-12 h-12 rounded-full" />
    </a>
  </div>
  <p>
    I'm a Software Engineer at Jahnel Group. I studied CS and Cybersecurity at
    Binghamton University. I have published and presented at ACM (Association
    for Computing Machinery) and IEEE (Institute of Electrical and Electronics
    Engineers) conferences. I've also worked for CodeSecure and Sonnet Software,
    and I love working on interesting projects. If you've got something cool for
    me to do, let's connect! While you're here, check out some of my
    <a href="/projects">projects</a>!
  </p>
  <!-- <p>
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
  </p> -->
  <div class="flex gap-2 justify-end items-center flex-wrap">
    <button
      class={clsx(
        "flex items-center gap-4 rounded-md p-2 bg-subtle",
        email_ready && "hover:bg-subtle/75 border-primary"
      )}
      on:click={() => {
        if (email_ready) {
          navigator.clipboard.writeText(email);
          copied = true;
          setTimeout(() => (copied = false), 800);
        } else {
          getEmail();
        }
      }}
    >
      {#if email_ready}
        <div class="center relative text-sm">
          <p
            class={clsx(
              "transition-opacity md:text-base ml-1",
              email_ready ? "opacity-100" : "opacity-0",
              copied && "animate-peeked"
            )}
          >
            {email}
          </p>
          <div class="absolute inset-0 center">
            <p class={clsx(copied ? "animate-peek" : "opacity-0")}>Copied!</p>
          </div>
        </div>
        <div class="relative">
          <div class={clsx(copied && "animate-peeked")}>
            <CopyIcon width={48} />
          </div>
          <div
            class={clsx(
              "absolute inset-0 text-confirm rounded-lg flex justify-center items-center",
              copied ? "animate-peek" : "opacity-0"
            )}
          >
            <CheckIcon size={36} stroke={3} />
          </div>
        </div>
      {:else}
        <MailIcon width={48} />
      {/if}
    </button>
    <a
      href="https://www.linkedin.com/in/ethan-ferguson-112011193/"
      target="_blank"
      class="self-end p-2 bg-subtle rounded-lg hover:bg-subtle/75"
    >
      <img
        src={linkedin}
        alt="LinkedIn Logo"
        class="h-12 w-12 border-transparent hover:border-highlight border rounded"
      />
    </a>
  </div>
</div>
