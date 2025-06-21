<script lang="ts">
    interface Props {
        children: any;
    }

    let { children }: Props = $props();
</script>

<div class="w-[60%] bg-white/20 rounded-3xl border-[2px] border-white/40 overflow-hidden shadow-xl">
    <div class="p-6 md:p-8">
        {@render children()}
    </div>
</div>
