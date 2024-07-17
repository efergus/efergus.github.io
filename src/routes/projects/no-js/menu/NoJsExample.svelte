<div id="menu_bar">
  <label>
    <input type="checkbox" />
    <div id="menu">Contents of the menu</div>
    <p>Toggle</p>
  </label>
</div>

<style>
  input {
    display: none;
  }
  input:checked ~ div#menu {
    transform: translateY(0px);
  }
  div#menu {
    transform: translateY(-100%);
  }

  /* ignore */
  div#menu {
    transition-timing-function: ease-in-out;
    transition-property: transform;
    transition-duration: 150ms;
    background-color: yellow;
    flex-grow: 1;
  }
  label {
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
