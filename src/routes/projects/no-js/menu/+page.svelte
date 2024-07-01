<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import PageMenu from "$lib/components/PageMenu.svelte";
  import JsExample from "./JsExample.svelte";

  import jsExample from "./JsExample.svelte?raw";
  import NoJsExample from "./NoJsExample.svelte";
  import noJsExample from "./NoJsExample.svelte?raw";
  import NoJsExampleComplications from "./NoJsExampleComplications.svelte";
</script>

<svelte:head>
  <title>No JS Mobile Menu</title>
</svelte:head>

<div class="col text-lg max-w-4xl markdown gap-4">
  <div>
    <h1>No-JS Mobile Menu</h1>
    <div class="bg-secondary">
      <PageMenu adaptive={false}>
        <h2 slot="title" class="ml-2">Example Mobile Menu</h2>
        <div class="bg-secondary p-4">
          <p>Here is an example menu</p>
          <p>It has some contents</p>
          <p>Look at that fancy animation!</p>
        </div>
      </PageMenu>
    </div>
  </div>

  <p>
    Almost every site needs a menu, and the pattern is pretty consistent. On
    large displays, you'll display some full version of the menu on the page at
    all times. On small displays, you'll have a button that opens some version
    of the menu. It's pretty clear how to do that with JavaScript.
    <code>onClick = moveMenu()</code>. Maybe trigger a fancy animation for your
    open/close button. What might be less clear is how to do that
    <i>without</i> relying on JS at all.
  </p>
  <p>
    Here I'm going to focus mostly on making the small-screen version, since the
    large-screen version has nothing fancy going on. The menu we'll be
    developing is the example above, which is also the one I use on this site.
  </p>

  <h2>The base case</h2>
  <p>
    How might we create a mobile menu that <i>does</i> use JS? It might look something
    like this: (Note this is in Svelte, so I can show you the result easily. If you're
    not familiar with it that's ok, it should still be easy to follow)
  </p>
  <pre><code>{jsExample}</code></pre>
  <Card>
    <JsExample />
  </Card>
  <p>
    that's the basic idea, just toggle the position using <code>transform</code>
    with <code>translate</code> when the toggle button is clicked. You can see it
    in action there. In order to get something nice, it'll have to be more complicated
    than that - a taller menu would be cut off, for example - but that's the general
    idea.
  </p>

  <h2>The trick</h2>
  <p>
    How do we accomplish that same idea with only CSS? We need a way to keep
    track of whether or not the menu is open, and use that information to style
    our menu. A good way to store user input in CSS is the
    <code>"checkbox"</code> input type. Using CSS, you can check if a checkbox is
    checked using `:checked`, and even style elements based on that information.
    It makes creating custom checkboxes very straightforwad, and is what we'll use
    to make this menu.
  </p>
  <pre><code>{noJsExample}</code></pre>
  <Card>
    <NoJsExample />
  </Card>
  <p>
    That's it! That's the basic idea - you just store the state of the menu in
    the checkbox, and it's perfectly interactible.
  </p>

  <h2>Complications</h2>
  <p>There are some complications with the menu as it stands.</p>
  <ol>
    <li>
      Putting the menu contents inside the <code>label</code> won't work If we want
      other inputs, like buttons, in the menu
    </li>
    <li>
      As implemented, the menu bar just grows to the size of the menu, which
      isn't very useful.
    </li>
  </ol>
  See here:
  <Card title="Complications">
    <NoJsExampleComplications>
      <p>Here is a menu</p>
      <p>That is tall</p>
      <p>And isn't very useful</p>
    </NoJsExampleComplications>
    <NoJsExampleComplications>
      <button class="rounded bg-black text-white m-2 p-2"
        >This is a <code>button</code></button
      >
      <button slot="button">Test</button>
    </NoJsExampleComplications>
  </Card>
  <h2>Animation</h2>
  <h2>JS Fallback</h2>
</div>
