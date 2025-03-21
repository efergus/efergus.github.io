<script lang="ts">
    import temml from "temml";
    import "temml/dist/Temml-Local.css";
    // import "temml/dist/Temml-Latin-Modern.css";

    export let tex: string;
    export let block: boolean = false;
</script>

{@html temml.renderToString(tex, { displayMode: block })}
