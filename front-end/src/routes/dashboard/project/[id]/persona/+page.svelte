<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import Button from "$lib/components/Button.svelte";

    interface Props {
        personaConfig: any;
        updatePersonaCount: (persona: string, change: number) => void;
        stopAllTests: () => void;
    }

    let { personaConfig, updatePersonaCount, stopAllTests }: Props = $props();
</script>

<Card>
    <h3 class="text-xl font-semibold text-gray-900 mb-6">Persona Control Center</h3>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each Object.entries(personaConfig) as [persona, config]}
            <div class="border border-white/40 rounded-xl p-4 bg-white/10 backdrop-blur-sm">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-2">
                        <span class="text-2xl">
                            {persona === "The Hacker" ? "🔒" :
                                persona === "Mobile Sarah" ? "📱" :
                                    persona === "Grandpa Joe" ? "👴" :
                                        persona === "Power User" ? "⚡" :
                                            persona === "Skeptical Sam" ? "🤔" : "♿"}
                        </span>
                        <h4 class="font-semibold text-gray-900">{persona}</h4>
                    </div>
                    <span class="px-2 py-1 rounded-full text-xs font-medium border {config.active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}">
                        {config.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                </div>

                <div class="flex items-center justify-between mb-4">
                    <span class="text-sm text-gray-600">Instances:</span>
                    <div class="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onclick={() => updatePersonaCount(persona, -1)}>-</Button>
                        <span class="w-8 text-center font-semibold">{config.count}</span>
                        <Button variant="outline" size="sm" onclick={() => updatePersonaCount(persona, 1)}>+</Button>
                    </div>
                </div>

                <div class="space-y-2">
                    {#if config.count > 0}
                        <Button variant="outline" size="sm" class="w-full">Stop All</Button>
                    {:else}
                        <Button variant="primary" size="sm" class="w-full" onclick={() => updatePersonaCount(persona, 1)}>Start Testing</Button>
                    {/if}
                </div>
            </div>
        {/each}
    </div>

    <div class="mt-8 pt-6 border-t border-white/30">
        <div class="flex items-center justify-between">
            <div>
                <h4 class="font-semibold text-gray-900">Total Active Agents: {Object.values(personaConfig).reduce((sum, config) => sum + config.count, 0)}</h4>
                <p class="text-sm text-gray-600">Estimated cost: $0.{(Object.values(personaConfig).reduce((sum, config) => sum + config.count, 0) * 12).toString().padStart(2, '0')}/hour</p>
            </div>
            <div class="space-x-2">
                <Button variant="outline" onclick={stopAllTests}>Stop All Tests</Button>
                <Button variant="primary">Save Configuration</Button>
            </div>
        </div>
    </div>
</Card>
