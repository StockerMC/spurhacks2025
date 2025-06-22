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

    // Helper: map agent name to human-friendly name
    const agentToHumanFriendlyName = (agent) => {
        if (agent === 'geek') return 'Power User';
        else if (agent === 'boomer') return 'Grandpa Joe';
        else if (agent === 'accessibility cop') return 'Accessibility Officer';
        else if (agent === 'hacker') return 'The Hacker';
        else return agent;
    };

    // Group actions by agent and get the last action with finalVerdict for each
    let finalResults = $state([]);
    $derived: if (testResults && testResults.length) {
        const byAgent = {};
        for (const action of testResults) {
            if (action.finalVerdict) {
                if (!byAgent[action.agent] || (action.created_at > byAgent[action.agent].created_at)) {
                    byAgent[action.agent] = action;
                }
            }
        }
        finalResults = Object.values(byAgent);
    }
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
                <h4 class="font-semibold text-gray-900 mb-4">Final Persona Results</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {#if finalResults.length === 0}
                    <p class="text-gray-500 col-span-2">No final persona results available.</p>
                  {:else}
                    {#each finalResults as result}
                      <div class="bg-white/90 rounded-xl shadow-lg border border-blue-100 p-6 flex flex-col gap-2">
                        <div class="flex items-center mb-2">
                          <span class="text-2xl mr-3">🧑‍💻</span>
                          <h4 class="text-lg font-bold text-blue-800 flex-1">{agentToHumanFriendlyName(result.agent)}</h4>
                          <span class="px-2 py-1 rounded-full text-xs font-semibold {result.finalVerdict === 'fail' ? 'bg-red-100 text-red-700' : result.finalVerdict === 'pass' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
                            {result.finalVerdict ? result.finalVerdict.toUpperCase() : 'N/A'}
                          </span>
                        </div>
                        {#if result.finalIssues}
                          <div>
                            <div class="font-semibold text-red-700 mb-1">Final Issues</div>
                            <ul class="list-disc list-inside text-red-700 text-sm">
                              {#each Array.isArray(result.finalIssues) ? result.finalIssues : [result.finalIssues] as issue}
                                <li>{issue}</li>
                              {/each}
                            </ul>
                          </div>
                        {/if}
                        {#if result.finalSuggestions}
                          <div>
                            <div class="font-semibold text-blue-700 mb-1">Recommendations</div>
                            <ul class="list-disc list-inside text-blue-700 text-sm">
                              {#each Array.isArray(result.finalSuggestions) ? result.finalSuggestions : [result.finalSuggestions] as suggestion}
                                <li>{suggestion}</li>
                              {/each}
                            </ul>
                          </div>
                        {/if}
                        {#if result.finalSummary}
                          <div>
                            <div class="font-semibold text-gray-800 mb-1">Summary</div>
                            <div class="text-gray-700 text-sm">{result.finalSummary}</div>
                          </div>
                        {/if}
                      </div>
                    {/each}
                  {/if}
                </div>
            </div>
        {/if}
    </Card>
</div>
