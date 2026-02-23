<script lang="ts">
    import temml from "temml";
    import "temml/dist/Temml-Local.css";
    

    interface Props {
        // import "temml/dist/Temml-Latin-Modern.css";
        tex: string;
        block?: boolean;
    }

    let { tex, block = false }: Props = $props();
</script>

{@html temml.renderToString(tex, { displayMode: block })}
