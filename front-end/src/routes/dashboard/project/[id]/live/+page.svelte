<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import Button from "$lib/components/Button.svelte";

    interface Props {
        selectedAgent: any;
        agentInstances: any[];
    }

    const agentToHumanFriendlyName = (agent) => {
        if (agent === 'geek') return 'Power User';
        else if (agent === 'boomer') return 'Grandpa Joe';
        else if (agent === 'accessibility cop') return 'Accessibility Officer';
        else return 'The Hacker'
    };

    let { selectedAgent = $bindable(), agentInstances }: Props = $props();

    const generateDockerLog = (agent) => {
        return [
            `[${new Date().toISOString()}] Starting agent container ${agent.id}`,
            `[${new Date().toISOString()}] Loading persona: ${agentToHumanFriendlyName(agent.name)}`,
            `[${new Date().toISOString()}] Connecting to target: https://example.com`,
            `[${new Date().toISOString()}] Executing: ${agent.action}`,
            `[${new Date().toISOString()}] Status: ${agent.status}`,
            `[${new Date().toISOString()}] Memory usage: 45MB`,
            `[${new Date().toISOString()}] CPU usage: 12%`,
            `[${new Date().toISOString()}] Network requests: 23`,
            `[${new Date().toISOString()}] Last heartbeat: ${agent.lastUpdate}`
        ];
    };
</script>

{#if selectedAgent}
    <!-- Agent Detail View -->
    <Card>
        <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3">
                <Button variant="outline" size="sm" onclick={() => selectedAgent = null}>← Back</Button>
                <h3 class="text-xl font-semibold text-gray-900">Container: {agentToHumanFriendlyName(selectedAgent.name)}</h3>
                <span class="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full border border-green-200">{selectedAgent.status}</span>
            </div>
            <Button variant="outline" size="sm">Stop Container</Button>
        </div>

        <!-- Descriptive Action Card -->
        <div class="bg-white/90 rounded-xl shadow-lg border border-blue-100 p-6 mb-6">
            <div class="flex items-center mb-2">
                <span class="text-2xl mr-3">🧠</span>
                <h4 class="text-lg font-bold text-blue-800 flex-1">{selectedAgent.title || 'Action Details'}</h4>
                <span class="px-2 py-1 rounded-full text-xs font-semibold {selectedAgent.finalVerdict === 'fail' ? 'bg-red-100 text-red-700' : selectedAgent.finalVerdict === 'pass' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
                    {selectedAgent.finalVerdict ? selectedAgent.finalVerdict.toUpperCase() : selectedAgent.status}
                </span>
            </div>
            <div class="text-gray-700 mb-2 text-sm">{selectedAgent.explanation}</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                <div>
                    <div class="font-semibold text-gray-800 mb-1">Agent</div>
                    <div class="text-gray-600">{selectedAgent.agent}</div>
                </div>
                <div>
                    <div class="font-semibold text-gray-800 mb-1">Time</div>
                    <div class="text-gray-600">
                        {selectedAgent.created_at
                            ? new Date(selectedAgent.created_at).toLocaleString()
                            : 'N/A'}
                    </div>
                </div>
            </div>
            {#if selectedAgent.changes && selectedAgent.changes.length}
                <div class="mb-2">
                    <div class="font-semibold text-gray-800 mb-1">Steps/Changes</div>
                    <ul class="list-disc list-inside text-gray-700 text-sm">
                        {#each selectedAgent.changes as change}
                            <li>{change}</li>
                        {/each}
                    </ul>
                </div>
            {/if}
            {#if selectedAgent.issues && selectedAgent.issues.length}
                <div class="mb-2">
                    <div class="font-semibold text-red-700 mb-1">Issues Found</div>
                    <ul class="list-disc list-inside text-red-700 text-sm">
                        {#each selectedAgent.issues as issue}
                            <li>{issue}</li>
                        {/each}
                    </ul>
                </div>
            {/if}
            <!-- {#if selectedAgent.finalIssues}
                <div class="mb-2">
                    <div class="font-semibold text-red-700 mb-1">Final Issues</div>
                    <div class="text-red-700 text-sm">{selectedAgent.finalIssues}</div>
                </div>
            {/if}
            {#if selectedAgent.finalRecommendations}
                <div class="mb-2">
                    <div class="font-semibold text-blue-700 mb-1">Recommendations</div>
                    <div class="text-blue-700 text-sm">{selectedAgent.finalRecommendations}</div>
                </div>
            {/if}
            {#if selectedAgent.finalSummary}
                <div class="mb-2">
                    <div class="font-semibold text-gray-800 mb-1">Summary</div>
                    <div class="text-gray-700 text-sm">{selectedAgent.finalSummary}</div>
                </div>
            {/if} -->
        </div>

        <div class="bg-black text-green-400 p-4 rounded-xl font-mono text-sm overflow-x-auto border border-gray-600">
            <div class="mb-2 text-gray-400">Docker Container Logs - {selectedAgent.id}</div>
            {#each generateDockerLog(selectedAgent) as log}
                <div class="mb-1">{log}</div>
            {/each}
            <div class="text-yellow-400 animate-pulse">$ Waiting for next command...</div>
        </div>

        <div class="mt-4 grid grid-cols-3 gap-4">
            <div class="text-center">
                <div class="text-lg font-semibold text-gray-900">45MB</div>
                <div class="text-sm text-gray-600">Memory Usage</div>
            </div>
            <div class="text-center">
                <div class="text-lg font-semibold text-gray-900">12%</div>
                <div class="text-sm text-gray-600">CPU Usage</div>
            </div>
            <div class="text-center">
                <div class="text-lg font-semibold text-gray-900">23</div>
                <div class="text-sm text-gray-600">Network Requests</div>
            </div>
        </div>
    </Card>
{:else}
    <!-- Agent List View -->
    <Card>
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">Live Agent Updates</h3>
            <Button variant="outline" size="sm">Auto-refresh: ON</Button>
        </div>

        <div class="space-y-4">
            {#each agentInstances as agent}
                <button
                        class="w-full border border-white/40 rounded-xl p-4 hover:bg-white/20 transition-all duration-200 text-left backdrop-blur-sm"
                        onclick={() => selectedAgent = agent}
                >
                    <div class="flex items-center justify-between mb-2">
                        <div class="flex items-center space-x-3">
                            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span class="font-semibold text-gray-900">{agentToHumanFriendlyName(agent.name)}</span>
                            <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200">{agent.status}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="text-sm text-gray-600">{agent.lastUpdate}</span>
                            <span class="text-gray-400">→</span>
                        </div>
                    </div>
                    <p class="text-gray-700">{agent.action}</p>
                </button>
            {/each}
        </div>
    </Card>
{/if}
