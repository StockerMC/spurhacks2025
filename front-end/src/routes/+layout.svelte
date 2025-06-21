<script lang="ts">
	import '../app.css';
  import '@fontsource-variable/figtree';
  let { children } = $props();
</script>

{@render children()}

<style>
    :global(body) {
        font-family: "Figtree Variable", sans-serif;
    }
</style>
