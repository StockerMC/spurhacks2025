<script lang="ts">
    import { onMount } from 'svelte';
    import SetupCat from "$lib/images/setup_cat.gif";

    let { step = 1, messages = [] } = $props();

    let currentMessage = $state(0);
    let showForm = $state(false);
    let fadeMessage = $state(true);
    let gifKey = $state(0); // Force gif reload
    let shouldBounce = $state(true);

    // Reset animations when step changes
    $effect(() => {
        gifKey = step; // This will force the gif to reload and play once
        shouldBounce = true;

        // Stop bounce after one cycle (3 seconds)
        setTimeout(() => {
            shouldBounce = false;
        }, 3000);
    });

    onMount(() => {
        currentMessage = 0;
        showForm = false;
        fadeMessage = true;

        const timer1 = setTimeout(() => {
            fadeMessage = false;
            setTimeout(() => {
                currentMessage = 1;
                fadeMessage = true;
                const timer2 = setTimeout(() => {
                    fadeMessage = false;
                    setTimeout(() => {
                        currentMessage = 2;
                        fadeMessage = true;
                        const timer3 = setTimeout(() => {
                            showForm = true;
                        }, 2000);
                    }, 300);
                }, 2000);
            }, 300);
        }, 2000);
    });
</script>

<div class="flex flex-col items-center justify-center mt-16">
    <div class="relative group">
        <!-- Cat GIF - Made Bigger -->
        <div class="relative">
            <img
                    src={SetupCat || "/placeholder.svg"}
                    alt="Cute animated cat"
                    class="w-72 h-72 object-contain {shouldBounce ? 'cat-bounce-once' : ''}"
                    key={gifKey}
            />
        </div>

        <!-- Speech Bubble - Always visible container -->
        <div class="absolute -top-16 -right-16">
            <div class="bg-white text-gray-800 text-sm px-4 py-3 rounded-2xl font-medium shadow-lg border border-gray-200 relative max-w-sm">
                <!-- Fading text content only -->
                <div class="whitespace-normal break-words transition-opacity duration-300 {fadeMessage ? 'opacity-100' : 'opacity-0'}">
                    {messages[currentMessage] || messages[0]}
                </div>
                <!-- Speech bubble tail -->
                <div class="absolute bottom-0 left-8 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white transform translate-y-full"></div>
            </div>
        </div>
    </div>
</div>

<style>
    .cat-bounce-once {
        animation: bounce-once 3s ease-in-out;
    }

    @keyframes bounce-once {
        0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
        }
        40%, 43% {
            transform: translate3d(0,-15px,0);
        }
        70% {
            transform: translate3d(0,-7px,0);
        }
        90% {
            transform: translate3d(0,-2px,0);
        }
    }
</style>
