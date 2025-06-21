<script lang="ts">
    interface Props {
        children: any;
        blurBackground?: boolean;
        class?: string;
    }

    const { children, blurBackground = false, class: customClass = '' }: Props = $props();
</script>

<div class={`bg-white/20 rounded-3xl border-[2px] border-white/40 overflow-hidden shadow-xl ${blurBackground ? 'backdrop-blur-md' : ''} ${customClass}`}>
    <div class="p-6 md:p-8">
        {@render children()}
    </div>
</div>
