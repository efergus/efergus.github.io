<script lang="ts">
</script>

<div id="menu_bar">
  <label>
    <input type="checkbox" />
    <div id="clip">
      <div id="menu">
        <p>Here is a menu</p>
        <p>That is tall</p>
        <p>And useful now</p>
      </div>
    </div>
    <div id="toggle">Toggle</div>
  </label>
</div>

<style>
  input {
    display: none;
  }
  input:checked ~ div div#menu {
    transform: translateY(0px);
  }
  label {
    position: relative;
  }
  div#menu {
    transform: translateY(-100%);
  }
  div#clip {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    overflow: hidden;
  }
  div#toggle {
    z-index: 10;
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
    justify-content: end;
    background-color: pink;
  }
  div {
    color: black;
  }
  /* ignore */
</style>
