<script lang="ts">
    interface Props {
        icon: string;
        name: string;
        description: string;
        question: string;
        selected?: boolean;
        onclick?: () => void;
    }

    let { icon, name, description, question, selected = false, onclick }: Props = $props();
</script>

<div class="relative group">
    <button
            class="w-full backdrop-blur-sm bg-white/25 rounded-2xl p-5 border-[2px] border-white/40 hover:bg-white/35 transition-all duration-300 hover:scale-105 {selected ? 'ring-2 ring-blue-500 bg-white/40' : ''} {onclick ? 'cursor-pointer' : 'cursor-default'}"
            onclick={onclick}
            disabled={!onclick}
    >
        <div class="text-2xl mb-2">{icon}</div>
        <h4 class="font-medium text-gray-900 mb-1 text-sm">{name}</h4>
        <p class="text-xs text-gray-700 mb-2 font-light">{description}</p>

        <!-- Cute speech bubble -->
        <div class="absolute -top-3 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
            <div class="bg-white text-gray-800 text-xs px-3 py-2 rounded-2xl whitespace-nowrap font-medium shadow-lg border border-gray-200 relative">
                "{question}"
                <div class="absolute bottom-0 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white transform translate-y-full"></div>
            </div>
        </div>

        {#if selected}
            <div class="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white text-xs">✓</span>
            </div>
        {/if}
    </button>
</div>
