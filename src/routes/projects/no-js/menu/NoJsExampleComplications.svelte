<script lang="ts">
</script>

<div id="menu_bar">
  <label>
    <input type="checkbox" />
    <div id="menu"><slot /></div>
    <div><slot name="button">Toggle</slot></div>
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

  /* Styling you don't have to worry about */
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
</style>
