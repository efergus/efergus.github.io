<script lang="ts">
  import Card from "$lib/components/Card.svelte";

  import mediaQuery from "./media-query.css?raw";
  import exampleJs from "./example-js.txt?raw";
  import exampleHtml from "./example.html?raw";
  import exampleCSS from "./example.css?raw";
  import Code from "$lib/components/Code.svelte";
  import DarkModeButton from "$lib/components/DarkModeButton.svelte";
</script>

<svelte:head>
  <title>No JS Dark Mode</title>
</svelte:head>

<div class="markdown max-w-4xl">
  <h1 class="mx-2">No JS Dark Mode</h1>

  <div class="flex flex-col gap-4 rounded-lg p-2">
    <div class="theme-focus flex justify-between">
      <h2>Isn't that easy?</h2>
      <DarkModeButton />
    </div>
    <p>
      Well, yes, actually. The easy case is super easy. That is, the case where
      you want the theme to be based on the user's system preferences. There's
      built-in CSS just for that purpose:
    </p>
    <pre><code>{mediaQuery}</code></pre>
    <p>
      But what if we want to let the user toggle dark mode with a button? Well,
      that's still easy if you're willing to use JavaScript:
    </p>
    <pre><code>{exampleJs}</code></pre>
    <p>
      With a little tweaking, we could even make that support the user's system
      preference. But what if we did something a little... weirder. A little
      more... CSS. What if we could add a dark mode selector while also
      respecting the user's system preference by default, all without a lick of
      the vile language that is JavaScript? (Ok it's not that bad). And even
      better, what if we could override the user's selection for certain parts
      as needed?
    </p>
    <p>
      Of course, you'll find that I've done just that. Open the menu (mobile) or
      scroll to the top (desktop) and click the moon icon to mess around with
      dark mode. Take a look at how this page reacts, including the sections
      below. Try turning off JavaScript if you can, you'll find the toggle still
      works!
    </p>
    <div class="max-w-2xl mx-auto">
      <Card>
        <div class="light rounded-lg p-4">
          Here's a little patch of light mode
          <Card title="Example Card">With some ready-to-go components</Card>
          <h1>Ok, not that many</h1>
          I only have so many theme-dependent components at the moment
        </div>
        <div class="dark rounded-lg p-4">
          And here's a little patch of dark mode
          <Card title="Another Card"
            >With some ready-to-go components
            <div class="flex justify-between rounded-lg p-4">
              <div>
                And what's this? A dark mode button within the dark modes?
                Should you even dare to click it?
              </div>
              <div class="theme-focus flex">
                <DarkModeButton />
              </div>
            </div>
          </Card>
          <h1>And</h1>
          <p>
            I didn't even have to specify a bunch of colors to make these
            components
          </p>
        </div>
      </Card>
    </div>
  </div>
  <div class="flex flex-col gap-4 rounded-lg p-2">
    <div class="theme-focus flex justify-between">
      <h2>How?</h2>
      <DarkModeButton />
    </div>
    <p>
      <a
        href="https://stackoverflow.com/questions/2497146/is-css-turing-complete"
        >CSS is turing complete</a
      >, you know. Not that it helps us here. What does help us is the
      <code>:has()</code>
      selector. We can set the CSS of an element based on its children! You could
      also make this kind of thing work with
      <code>~</code> if you're so inclined, but it's not as nice for this usecase.
      This has only been majorly supported for a few years, so this might not work
      for people who are really lagging on their browser updates. Even still, we
      can support their system preference and hide the button for them. The idea
      is really simple:
    </p>
    <div class="-m-2 p-2 rounded-lg">
      <div class="flex justify-between items-end theme-focus">
        <p>HTML:</p>
        <DarkModeButton />
      </div>
      <Code source={exampleHtml} lang={"html"} />
    </div>
    <div>
      <p>CSS:</p>
      <Code source={exampleCSS} lang={"css"} />
    </div>
    <p>
      We create the dark and light classes, apply them to the root element based
      on the system preference, and invert them when the checkbox is clicked.
      You can use those CSS variables to style your dark mode button, so it
      reacts to the changes in dark modiness. The <code>$gt</code> makes it match
      only immediate children, so you can nest them like they are on this pae.
    </p>
    <p>
      And that's it! Obviously this is a very basic example; the only two colors
      are black and white, and it only handles background and text color (you
      might want stroke, fill, etc), but you get the idea. The <code
        >@apply</code
      >
      lines are tailwind, they just apply the CSS of a class that already exists,
      which makes this a little more concise.
    </p>
    <p>
      Now, you can use the <code>dark</code> or <code>light</code> classes
      anywhere to control the theme, scoped to whatever element they are applied
      to. That's how the light/dark islands at the beginning of this post work.
      You could also add more themes, like <code>error</code> for error states, which
      would make that scoping ability extra useful.
    </p>
    <h2>Why?</h2>
    <p>
      This was a fun challenge for me, but I also think it's pretty practical! I
      always like to support the hypothetical non-JS user, and using only CSS
      means it will be pretty responsive compared to a JS implementation that
      has to run on the main thread. My favorite part, though, is that it's just
      a great way to set up theming, even if you don't have a need for the
      CSS-inly dark mode selector. And at the end of the day, isn't that what
      we're all dreaming of? ...right?
    </p>
    <h2>P.S. - JS Fallback</h2>
    <p>
      Since there is a chance someone's browser won't support this, you can
      double-down by adding a JS fallback. That's also pretty easy, just apply
      the
      <code>light</code> and <code>dark</code> classes based on the state of the
      checkbox. You can have both the CSS and JS version working at the same time,
      they don't conflict with each other. Then you don't have to hide the button
      in case it is unsupported. That's what I've done on this site, and it's what
      I would recommend if you do implement this approach.
    </p>
  </div>
</div>
