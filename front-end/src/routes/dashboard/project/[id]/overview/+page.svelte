<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import Button from "$lib/components/Button.svelte";

    interface Props {
        testingStarted: boolean;
        elapsedTime: string;
        testResults: any[];
        agentInstances: any[];
        startTesting: () => void;
        stopAllTests: () => void;
    }

    let {
        testingStarted,
        elapsedTime,
        testResults,
        agentInstances,
        startTesting,
        stopAllTests,
    }: Props = $props();

    const getVerdictColor = (verdict: string) => {
        switch (verdict) {
            case "pass":
                return "bg-green-100 text-green-800 border-green-200";
            case "partial":
                return "bg-orange-100 text-orange-800 border-orange-200";
            case "fail":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };
</script>

<!-- Testing Status Card - Full Width -->
<div class="mb-6">
    <Card>
        <div class="text-center p-4">
            {#if !testingStarted}
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                    START TESTING
                </h3>
                <p class="text-gray-600 mb-6">
                    Begin automated testing with AI agents
                </p>
                <Button variant="primary" onclick={startTesting}>
                    Start Testing
                </Button>
            {:else}
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                    TESTING IN PROGRESS
                </h3>
                <div class="text-3xl font-bold text-[#6DBDD5] mb-2">
                    {elapsedTime}
                </div>
                <div class="text-sm text-gray-500 mb-4">elapsed</div>
                <Button variant="primary" onclick={stopAllTests}>
                    Stop Testing
                </Button>
            {/if}
        </div>
    </Card>
</div>

<!-- Results Preview and Agent Activity - Side by Side -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Results Preview Card -->
    <Card>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Latest Results</h3>
        <div class="space-y-3">
            {#if testResults.length === 0}
                <p class="text-gray-500 text-center py-4">No results yet</p>
            {:else}
                {#each testResults.slice(0, 3) as result}
                    <div
                        class="flex items-start space-x-3 p-3 bg-white/30 rounded-xl border border-white/40"
                    >
                        <span
                            class="px-2 py-1 rounded-full text-xs font-medium {getVerdictColor(
                                result.verdict,
                            )}"
                        >
                            {result.verdict.toUpperCase()}
                        </span>
                        <div class="flex-1">
                            <p class="text-sm font-medium text-gray-900">
                                {result.agent} - {result.page}
                            </p>
                            <p class="text-xs text-gray-600">
                                {result.summary}
                            </p>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </Card>

    <!-- Agent Activity Card -->
    <Card>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Agent Activity</h3>
        <div class="max-h-64 overflow-y-auto space-y-3 pr-2">
            {#if testingStarted && agentInstances.length > 0}
                {#each agentInstances as agent}
                    <div class="flex items-center space-x-3">
                        <div
                            class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                        ></div>
                        <div class="flex-1">
                            <p class="text-sm font-medium text-gray-900">
                                {agent.name} #{agent.hash}
                            </p>
                            <p class="text-xs text-gray-600">{agent.action}</p>
                        </div>
                        <span class="text-xs text-gray-500"
                            >{agent.lastUpdate}</span
                        >
                    </div>
                {/each}
            {:else}
                <p class="text-gray-500 text-center py-4">No active agents</p>
            {/if}
        </div>
    </Card>
</div>
