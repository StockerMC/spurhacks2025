<script lang="ts">
    import Card from "$lib/components/Card.svelte";

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

    // Generate overall summary and score
    const generateOverallSummary = () => {
        const totalTests = testResults.length;
        const passCount = testResults.filter(r => r.verdict === 'pass').length;
        const partialCount = testResults.filter(r => r.verdict === 'partial').length;
        const failCount = testResults.filter(r => r.verdict === 'fail').length;

        const score = Math.round(((passCount * 100) + (partialCount * 50)) / totalTests);

        return {
            score,
            totalTests,
            passCount,
            partialCount,
            failCount,
            summary: `Testing completed with ${score}% overall score. ${failCount} critical issues found requiring immediate attention, ${partialCount} areas need improvement, and ${passCount} components passed all tests.`
        };
    };
</script>

<div class="space-y-6">
    <Card>
        <h3 class="text-xl font-semibold text-gray-900 mb-6">Overall Summary</h3>

        {#if testResults.length === 0}
            <div class="text-center py-8">
                <p class="text-gray-500">No data available. Complete some tests to see the summary.</p>
            </div>
        {:else}
            {@const summary = generateOverallSummary()}

            <!-- Score Overview -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="text-center p-4 bg-white/20 rounded-xl border border-white/40">
                    <div class="text-3xl font-bold text-[#6DBDD5] mb-2">{summary.score}%</div>
                    <div class="text-sm text-gray-600">Overall Score</div>
                </div>
                <div class="text-center p-4 bg-white/20 rounded-xl border border-white/40">
                    <div class="text-3xl font-bold text-green-600 mb-2">{summary.passCount}</div>
                    <div class="text-sm text-gray-600">Passed</div>
                </div>
                <div class="text-center p-4 bg-white/20 rounded-xl border border-white/40">
                    <div class="text-3xl font-bold text-orange-600 mb-2">{summary.partialCount}</div>
                    <div class="text-sm text-gray-600">Partial</div>
                </div>
                <div class="text-center p-4 bg-white/20 rounded-xl border border-white/40">
                    <div class="text-3xl font-bold text-red-600 mb-2">{summary.failCount}</div>
                    <div class="text-sm text-gray-600">Failed</div>
                </div>
            </div>

            <!-- Summary Text -->
            <div class="bg-white/20 rounded-xl p-6 border border-white/40">
                <h4 class="font-semibold text-gray-900 mb-3">Executive Summary</h4>
                <p class="text-gray-700 leading-relaxed">{summary.summary}</p>
            </div>

            <!-- Individual Summaries -->
            <div class="mt-6">
                <h4 class="font-semibold text-gray-900 mb-4">Individual Test Summaries</h4>
                <div class="space-y-3">
                    {#each testResults as result}
                        <div class="flex items-start space-x-3 p-4 bg-white/10 rounded-xl border border-white/40">
                            <span class="px-2 py-1 rounded-full text-xs font-medium {getVerdictColor(result.verdict)}">
                                {result.verdict.toUpperCase()}
                            </span>
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-900 mb-1">{result.agent} - {result.page}</p>
                                <p class="text-sm text-gray-600">{result.summary}</p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    </Card>
</div>
