<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import Button from "$lib/components/Button.svelte";
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { createClient } from "@supabase/supabase-js";

    interface Props {
        testResults: any[];
    }

    onMount(async () => {
        let { data, error } = await supabase
            .from("media")
            .select("*")
            .eq("project_id", page.params.id);
        media = data || [];
    });

    const supabase = createClient(
        "https://ttnxgveqyvtsjlwvpecl.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0bnhndmVxeXZ0c2psd3ZwZWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NDUwNzgsImV4cCI6MjA2NjEyMTA3OH0.EkiiotOoeCCpt5kY2_oSVVTCm_7M9IXoNWUt5O8WiwQ"
    );
    let media = $state([]);

    let { testResults }: Props = $props();

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

    // Helper: map agent name to human-friendly name
    const agentToHumanFriendlyName = (agent) => {
        if (agent === 'geek') return 'Power User';
        else if (agent === 'boomer') return 'Grandpa Joe';
        else if (agent === 'accessibility cop') return 'Accessibility Officer';
        else if (agent === 'hacker') return 'The Hacker';
        else return agent;
    };

    // Group actions by agent and get the last action with finalVerdict for each
    import { derived } from "svelte/store";

    const finalResults = derived(
        () => testResults,
        ($testResults) => {
            if (!$testResults || !$testResults.length) {
                return [];
            } else {
                const byAgent = {};
                for (const action of $testResults) {
                    if (action.finalVerdict) {
                        if (!byAgent[action.agent] || (action.created_at > byAgent[action.agent].created_at)) {
                            byAgent[action.agent] = action;
                        }
                    }
                }
                return Object.values(byAgent);
            }
        }
    );
</script>

<div class="space-y-6">
  <Card>
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-semibold text-gray-900">Screenshots</h3>
      <div class="flex space-x-2">
        <Button variant="outline" size="sm">Filter</Button>
        <Button variant="outline" size="sm">Export</Button>
      </div>
    </div>
    <div class="space-y-4">
      {#if media.length === 0}
        <p class="text-gray-500">No screenshots available.</p>
      {/if}
      {#each media.toReversed() as item}
        <img src={item.url} alt={item.name} class="w-full h-auto rounded-lg shadow-md"/>
      {/each}
    </div>
  </Card>

  <!-- Final Results for Each Persona
  <Card>
    <h3 class="text-xl font-semibold text-gray-900 mb-6">Final Results by Persona</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#if finalResults.length === 0}
        <p class="text-gray-500 col-span-2">No final results available.</p>
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
  </Card> -->
</div>
