<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
    button?: import('svelte').Snippet;
  }

  let { children, button }: Props = $props();
</script>

<div id="menu_bar">
  <label>
    <input type="checkbox" />
    <div id="menu">{@render children?.()}</div>
    <div>{#if button}{@render button()}{:else}Toggle{/if}</div>
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
