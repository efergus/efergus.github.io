<script lang="ts">
  interface Props {
    size?: number;
    width?: any;
    height?: any;
    stroke?: number;
  }

  let {
    size = 24,
    width = size,
    height = size,
    stroke = 2
  }: Props = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  {width}
  {height}
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width={stroke}
  stroke-linecap="round"
  stroke-linejoin="round"
  class="feather feather-check"
  ><polyline points="20 6 9 17 4 12"></polyline></svg
>
