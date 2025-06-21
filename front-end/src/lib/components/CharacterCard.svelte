<script lang="ts">
    export let icon: string;
    export let name: string;
    export let description: string;
    export let question: string;
</script>

<div class="relative group">
    <div class="backdrop-blur-sm bg-white/25 rounded-2xl p-5 border-[2px] border-white/40 hover:bg-white/35 transition-all duration-300 hover:scale-105">
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
    </div>
</div>
