<script>
</script>

<button
        class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background px-4 py-2"
>
  <slot>
  </slot>
</button>

<style>
    button {
        cursor: pointer;
    }

    button:hover {
        opacity: 0.9;
    }

    button:active {
        transform: translateY(1px);
    }
</style>
