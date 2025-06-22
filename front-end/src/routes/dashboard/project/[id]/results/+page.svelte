<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import Button from "$lib/components/Button.svelte";

    interface Props {
        testResults: any[];
    }

    let { testResults }: Props = $props();

    const getVerdictColor = (verdict: string) => {
        switch(verdict) {
            case 'pass': return 'bg-green-100 text-green-800 border-green-200';
            case 'partial': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'fail': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
</script>

<div class="space-y-6">
    <Card>
        <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-semibold text-gray-900">Test Results</h3>
            <div class="flex space-x-2">
                <Button variant="outline" size="sm">Filter</Button>
                <Button variant="outline" size="sm">Export</Button>
            </div>
        </div>

        <div class="space-y-4">
            {#if testResults.length === 0}
                <div class="text-center py-8">
                    <p class="text-gray-500">No results yet. Start testing to see results.</p>
                </div>
            {:else}
                {#each testResults as result}
                    <div class="border border-white/40 rounded-xl p-6 bg-white/10 backdrop-blur-sm">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex items-center space-x-3">
                                <span class="px-3 py-1 rounded-full text-xs font-medium {getVerdictColor(result.verdict)}">
                                    {result.verdict.toUpperCase()}
                                </span>
                                <h4 class="font-semibold text-gray-900">{result.agent} - {result.page}</h4>
                            </div>
                        </div>

                        <div class="mb-4">
                            <p class="text-sm text-gray-700 mb-3">{result.summary}</p>
                        </div>

                        {#if result.issues.length > 0}
                            <div class="mb-4">
                                <h5 class="font-medium text-gray-900 mb-2">Issues Found:</h5>
                                <ul class="space-y-1">
                                    {#each result.issues as issue}
                                        <li class="text-sm text-red-700 bg-red-50 px-3 py-1 rounded border border-red-200">• {issue}</li>
                                    {/each}
                                </ul>
                            </div>
                        {/if}

                        {#if result.recommendations.length > 0}
                            <div>
                                <h5 class="font-medium text-gray-900 mb-2">Recommendations:</h5>
                                <ul class="space-y-1">
                                    {#each result.recommendations as rec}
                                        <li class="text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded border border-blue-200">• {rec}</li>
                                    {/each}
                                </ul>
                            </div>
                        {/if}
                    </div>
                {/each}
            {/if}
        </div>
    </Card>
</div>
