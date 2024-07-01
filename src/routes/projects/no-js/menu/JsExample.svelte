<script lang="ts">
  let show = false;

  let toggleMenu = () => {
    show = !show;
  };
</script>

<div id="menu_bar">
  <div id="menu" class={show ? "show" : ""}>Contents of the menu</div>
  <button on:click={toggleMenu}>Toggle</button>
</div>

<style>
  div#menu {
    transform: translateY(-100%);
  }
  div#menu.show {
    transform: translateY(0px);
  }

  /* ignore */
  div#menu {
    transition-timing-function: ease-in-out;
    transition-property: transform;
    transition-duration: 150ms;
    transform: translateY(-100%);
    background-color: yellow;
    flex-grow: 1;
  }
  div#menu_bar {
    display: flex;
    justify-content: stretch;
    overflow: hidden;
    background-color: pink;
  }
  div {
    color: black;
  }
  /* ignore */
</style>
