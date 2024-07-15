<script lang="ts">
  import Card from "$lib/components/Card.svelte";
  import PageMenu from "$lib/components/PageMenu.svelte";
  import JsExample from "./JsExample.svelte";
  import NoJsExample from "./NoJsExample.svelte";
  import NoJsExampleComplications from "./NoJsExampleComplications.svelte";
  import NoJsFixed from "./NoJsFixed.svelte";

  import jsExample from "./JsExample.svelte?raw";
  import noJsExample from "./NoJsExample.svelte?raw";
  import noJsFixed from "./NoJsFixed.svelte?raw";
  import Code from "$lib/components/Code.svelte";

  const ignore = (str: string) => {
    const re = /\n(\n|\s)*\/\* ignore(\n|.)*ignore \*\/(\n|\s)*\n/g;
    return str.replace(re, "\n");
  };
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
    all times. On small displays, you'll have a button that opens the menu. It's
    pretty clear how to do that with JavaScript.
    <code>onClick = moveMenu()</code>. Maybe trigger a fancy animation for your
    open/close button. What might be less clear is how to do that without
    relying on JS <i>at all</i>.
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
  <Code source={ignore(jsExample)} lang="js" />
  <Card>
    <JsExample />
  </Card>
  <p>
    there it is, just toggle the position using <code>transform</code> when the "toggle"
    button is clicked. You can see it in action there. In order to get something
    nice, it'll have to be more complicated than that - a taller menu would be cut
    off, for example - but that's the general idea.
  </p>

  <h2>The trick</h2>
  <p>
    How do we accomplish that same idea with only CSS? We need a way to keep
    track of whether or not the menu is open, and use that information to style
    our menu. A good way to store user input in CSS is the
    <code>"checkbox"</code> input type. Using CSS, you can check if a checkbox
    is checked using <code>:checked</code>, and even style elements based on
    that information. It makes creating custom checkboxes very straightforwad,
    and is what we'll use to make this menu.
  </p>
  <Code source={ignore(noJsExample)} lang="xml" />
  <Card>
    <NoJsExample />
  </Card>
  <p>
    That's the basic idea! You just store the state of the menu in the checkbox,
    and it's perfectly interactible automatically.
  </p>

  <h2>Complications</h2>
  <p>There are some complications with the menu as it stands.</p>
  <ol>
    <li>
      The menu bar height always takes up the height of the full menu, which
      isn't very useful
    </li>
    <li>The dropdown doesn't span the entire menu width</li>
    <li>
      You should probably assign an id to the <code>label</code>-<code
        >input</code
      >
      pair. That is obviously easy to fix, I left it out here for simplicity. You
      could also use the <code>:has</code> selector instead if you want to try implementing
      this a slightly different way, that would allow you to put the menu outside
      the label
    </li>
    <li>
      If you're actually going to implement this, I wouldn't recommend
      specifying all of the styles with <code>id</code>s. Again, I did that for
      simplicity/clarity
    </li>
  </ol>
  See here:
  <Card title="Complications" subtitle="Menu Size">
    <NoJsExampleComplications>
      <p>Here is a menu</p>
      <p>That is tall</p>
      <p>And isn't very useful</p>
    </NoJsExampleComplications>
  </Card>
  <p>
    We can fix the menu size by using another <code>div</code>
  </p>

  <Code source={ignore(noJsFixed)} lang="xml" />
  <Card title="Fixed" scroll={false}>
    <NoJsFixed />
  </Card>
  <p>
    And that's it! The extra div automatically takes the size of its contents,
    so it's the perfect size to crop our menu. And, all this works without any
    JS! Try disabling JavaScript on this page (you can use a special extension
    for that, or if you have uBlock Origin click "More" and <code>&lt/&gt</code
    >). The initial JS example won't work, but all the others do! And, so does
    the menu on this page. It's also easy to add optional functionality that
    does use JS if you want, like closing the menu if you click outside for
    example.
  </p>
  <h2>Animation</h2>
  <p>
    You'll notice the example menu even has a nice animation for the hamburger
    button. That is also done entirely in CSS. It works similarly to how the
    menu itself does, except it animates SVG <code>line</code>s. I won't go into
    detail here, but if you're interested check out the GitHub repo for this
    site
    <a href="https://github.com/efergus/efergus.github.io/tree/main">here</a>.
  </p>

  <h2>Why bother?</h2>
  <p>
    Well, for fun, mostly. But also, because not everyone has JS! Some people
    are waiting for JS to load because your site is bloated, or they're on a
    micro-browser, or they have it disabled for security reasons.
  </p>

  <h2>Notes</h2>
  <ul>
    <li>
      This obviously isn't everything involved in the exact menu on this site,
      but it's enough to get you close. There's a ton of customization you could
      do to make it behave just the way you like.
    </li>
    <li>
      Firefox can be a bit finnicky with absolute positioning/sizing, so make
      sure whatever you do works there.
    </li>
    <li>
      If you want to put other form elements in the menu, you'll want to use a
      different approach. Using <code>:has</code> like I allude to above is likely
      what you would want.
    </li>
  </ul>
</div>
