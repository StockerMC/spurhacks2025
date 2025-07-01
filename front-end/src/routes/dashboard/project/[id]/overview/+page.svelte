<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import Button from "$lib/components/Button.svelte";
    import { createClient } from "@supabase/supabase-js";
    import { page } from "$app/state";
    import { onMount } from "svelte";
    import Box2 from "$lib/images/box2.png";

    onMount(async () => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && selectedAgent) {
                selectedAgent = null;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    });

    interface Props {
        testingStarted: boolean;
        elapsedTime: string;
        testResults: any[];
        agentInstances: any[];
        startTesting: () => void;
        stopAllTests: () => void;
    }

    onMount(async () => {
        let { data, error } = await supabase
            .from("actions")
            .select("*")
            .eq("project_id", page.params.id);
        actions = data || [];
    });

    const supabase = createClient(
        "https://ttnxgveqyvtsjlwvpecl.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0bnhndmVxeXZ0c2psd3ZwZWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NDUwNzgsImV4cCI6MjA2NjEyMTA3OH0.EkiiotOoeCCpt5kY2_oSVVTCm_7M9IXoNWUt5O8WiwQ"
    );
    let actions = $state([]);

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
            case "success":
                return "bg-green-100 text-green-800 border-green-200";
            case "partial":
                return "bg-orange-100 text-orange-800 border-orange-200";
            case "failure":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const agentToHumanFriendlyName = (agent) => {
        if (agent === "geek") return "Power User";
        else if (agent === "boomer") return "Grandpa Joe";
        else if (agent === "accessibility cop") return "Accessibility Officer";
        else if (agent === 'hacker') return "The Hacker";
        else return 'Mr. Meow'
    };
    let selectedAgent = $state(null);

</script>

<!-- svelte-ignore a11y_img_redundant_alt -->
<img src={Box2} alt="Box Image"
     class="absolute bottom-12 left-40 h-36 object-cover pointer-events-none"/>

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
      {#if actions.length === 0}
        <p class="text-gray-500 text-center py-4">No results yet</p>
      {:else}
        {#each actions.slice(0, 3) as action}
          <div
                  class="flex items-start space-x-3 p-3 bg-white/30 rounded-xl border border-white/40"
          >
                        <span
                                class="px-2 py-1 rounded-full text-xs font-medium {getVerdictColor(
                                action.status,
                            )}"
                        >
                            {agentToHumanFriendlyName(action.agent)}
                        </span>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">
                {JSON.parse(action.finalIssues)[0] ?? action.status}
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
    <div class="bg-[#18181b] rounded-xl p-4 font-mono text-sm text-green-400 max-h-64 overflow-y-auto border border-gray-700 shadow-inner relative">
      <div class="mb-2 text-gray-400">
        ┌─[pawditor@agents]─[Activity]
      </div>
      {#if selectedAgent}
        <div>
          <div class="text-blue-400 mb-2">
            $ agentctl inspect {selectedAgent.name}
          </div>
          <div class="text-gray-300 mb-2">
            Status: <span
                  class="{selectedAgent.status === 'completed' ? 'text-green-400' : selectedAgent.status === 'error' ? 'text-red-400' : 'text-yellow-400'}">{selectedAgent.status}</span>
          </div>
          <div class="text-gray-300 mb-2">
            Title: {selectedAgent.title || selectedAgent.action}
          </div>
          <div class="text-gray-300 mb-2">
            Last Update: {selectedAgent.lastUpdate}
          </div>
          <div class="text-gray-300 mb-2">
            Issues: {selectedAgent.issues?.length || 0}
          </div>
          <div class="text-gray-300 mb-2">
            Changes: {selectedAgent.changes?.length || 0}
          </div>
          <div class="text-gray-400 mt-4">
            [Press <span class="text-yellow-400">ESC</span> to go back]
          </div>
        </div>
      {:else if testingStarted && agentInstances.length > 0}
        {#each agentInstances as agent}
          <div class="flex items-center mb-1">
            <span class="text-blue-400 mr-2">$</span>
            <button
                    class="text-left flex-1 hover:text-yellow-300 cursor-pointer transition"
                    onclick={() => { selectedAgent = agent; }}
            >
              {agentToHumanFriendlyName(agent.agent)} <span
                    class="{agent.status === 'completed' ? 'text-green-400' : agent.status === 'error' ? 'text-red-400' : 'text-yellow-400'}">[{agent.status}
              ]</span>
              <span class="text-gray-500 ml-2">{agent.title || agent.action}</span>
            </button>
          </div>
        {/each}
      {:else}
        <div class="text-gray-500 py-4">$ {testingStarted ? "Agents are working..." : "No active testing"}</div>
      {/if}
      <div class="absolute bottom-2 left-4 text-green-400">
        <span class="animate-pulse">▊</span>
      </div>
    </div>
  </Card>
</div>

<style>
    @keyframes blink {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
    }

    .animate-pulse {
        animation: blink 1s step-end infinite;
    }
</style>