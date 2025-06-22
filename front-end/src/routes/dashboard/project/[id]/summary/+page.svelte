<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import { createClient } from "@supabase/supabase-js";
    import { onMount } from "svelte";
    import { page } from "$app/state";

    interface Props {
        testResults: any[];
    }

    onMount(async () => {
        let { data: d1, error } = await supabase
            .from("actions")
            .select("*")
            .eq("project_id", page.params.id)
            .eq("agent", "hacker")
            .order("created_at", { ascending: false })
            .limit(1);

        hackerSummary = d1[0] || {};

        let { data: d2, error: e2 }
            = await supabase
            .from("actions")
            .select("*")
            .eq("project_id", page.params.id)
            .eq("agent", "boomer")
            .order("created_at", { ascending: false })
            .limit(1);

        boomerSummary = d2[0] || {};

        let { data: d3, error: e3 }
            = await supabase
            .from("actions")
            .select("*")
            .eq("project_id", page.params.id)
            .eq("agent", "accessibility cop")
            .order("created_at", { ascending: false })
            .limit(1);

        accessibilityCopSummary = d3[0] || {};

        let { data: d4, error: e4 }
            = await supabase
            .from("actions")
            .select("*")
            .eq("project_id", page.params.id)
            .eq("agent", "geek")
            .order("created_at", { ascending: false })
            .limit(1);

        powerUserSummary = d4[0] || {};
    });

    const supabase = createClient(
        "https://ttnxgveqyvtsjlwvpecl.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0bnhndmVxeXZ0c2psd3ZwZWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NDUwNzgsImV4cCI6MjA2NjEyMTA3OH0.EkiiotOoeCCpt5kY2_oSVVTCm_7M9IXoNWUt5O8WiwQ"
    );

    let hackerSummary = $state({});
    let boomerSummary = $state({});
    let accessibilityCopSummary = $state({});
    let powerUserSummary = $state({});

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

    // Generate overall summary and score
    const generateOverallSummary = () => {
        const totalTests = testResults.length;
        const passCount = testResults.filter(r => r.verdict === "pass").length;
        const partialCount = testResults.filter(r => r.verdict === "partial").length;
        const failCount = testResults.filter(r => r.verdict === "fail").length;

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
        if (agent === "geek") return "Power User";
        else if (agent === "boomer") return "Grandpa Joe";
        else if (agent === "accessibility cop") return "Accessibility Officer";
        else if (agent === "hacker") return "The Hacker";
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
        <!--                Show each summary for each persona-->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {#each [hackerSummary, boomerSummary, accessibilityCopSummary, powerUserSummary] as agentSummary}
            <div class="bg-white/20 rounded-xl p-4 border border-white/40">
              <h5 class="font-semibold text-gray-900 mb-2">{agentToHumanFriendlyName(agentSummary.agent)}</h5>
              <p class="text-gray-700 mb-2">{agentSummary.finalSummary || "No summary available."}</p>
              <p class="text-sm text-gray-500">Last updated: {new Date(agentSummary.created_at).toLocaleString()}</p>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </Card>
</div>
