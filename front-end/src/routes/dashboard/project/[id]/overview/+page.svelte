<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import Button from "$lib/components/Button.svelte";
    import { createClient } from "@supabase/supabase-js";
    import { page } from "$app/state";
    import { onMount } from "svelte";

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
        else return "The Hacker";
    };
    let selectedAgent = $state(null);

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
        {#each actions.slice(0, 3) as action}
          <div
                  class="flex items-start space-x-3 p-3 bg-white/30 rounded-xl border border-white/40"
          >
                        <span
                                class="px-2 py-1 rounded-full text-xs font-medium {getVerdictColor(
                                action.status,
                            )}"
                        >
                            {action.agent}
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
    <div class="max-h-64 overflow-y-auto space-y-3 pr-2">
      {#if selectedAgent}
        <!-- Agent Detail View (copied from /live) -->
        <div>
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center space-x-3">
              <Button
                      variant="outline"
                      size="sm"
                      onclick={() => (selectedAgent = null)}
              >← Back
              </Button
              >
              <h3 class="text-xl font-semibold text-gray-900">
                Container: {agentToHumanFriendlyName(
                  selectedAgent.name,
              )}
              </h3>
              <span
                      class="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full border border-green-200"
              >{selectedAgent.status}</span
              >
            </div>
            <Button variant="outline" size="sm"
            >Stop Container
            </Button
            >
          </div>
          <div
                  class="cursor-pointer bg-white/90 rounded-xl shadow-lg border border-blue-100 p-6 mb-6"
          >
            <div class="flex items-center mb-2">
              <span class="text-2xl mr-3">🧠</span>
              <h4 class="text-lg font-bold text-blue-800 flex-1">
                {selectedAgent.title || "Action Details"}
              </h4>
              <span
                      class="px-2 py-1 rounded-full text-xs font-semibold {selectedAgent.finalVerdict ===
                                'fail'
                                    ? 'bg-red-100 text-red-700'
                                    : selectedAgent.finalVerdict === 'pass'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-yellow-100 text-yellow-700'}"
              >
                                {selectedAgent.finalVerdict
                                    ? selectedAgent.finalVerdict.toUpperCase()
                                    : selectedAgent.status}
                            </span>
            </div>
            <div class="text-gray-700 mb-2 text-sm">
              {selectedAgent.explanation}
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
              <div>
                <div class="font-semibold text-gray-800 mb-1">
                  Agent
                </div>
                <div class="text-gray-600">
                  {selectedAgent.agent}
                </div>
              </div>
              <div>
                <div class="font-semibold text-gray-800 mb-1">
                  Time
                </div>
                <div class="text-gray-600">
                  {selectedAgent.created_at
                      ? new Date(
                          selectedAgent.created_at,
                      ).toLocaleString()
                      : "N/A"}
                </div>
              </div>
            </div>
            {#if selectedAgent.changes && selectedAgent.changes.length}
              <div class="mb-2">
                <div class="font-semibold text-gray-800 mb-1">
                  Steps/Changes
                </div>
                <ul
                        class="list-disc list-inside text-gray-700 text-sm"
                >
                  {#each selectedAgent.changes as change}
                    <li>{change}</li>
                  {/each}
                </ul>
              </div>
            {/if}
            {#if selectedAgent.issues && selectedAgent.issues.length}
              <div class="mb-2">
                <div class="font-semibold text-red-700 mb-1">
                  Issues Found
                </div>
                <ul
                        class="list-disc list-inside text-red-700 text-sm"
                >
                  {#each selectedAgent.issues as issue}
                    <li>{issue}</li>
                  {/each}
                </ul>
              </div>
            {/if}
          </div>
          <div
                  class="bg-black text-green-400 p-4 rounded-xl font-mono text-sm overflow-x-auto border border-gray-600"
          >
            <div class="mb-2 text-gray-400">
              Docker Container Logs - {selectedAgent.id}
            </div>
            {#each [`[${new Date().toISOString()}] Starting agent container ${selectedAgent.id}`, `[${new Date().toISOString()}] Loading persona: ${agentToHumanFriendlyName(selectedAgent.name)}`, `[${new Date().toISOString()}] Connecting to target: https://example.com`, `[${new Date().toISOString()}] Executing: ${selectedAgent.action}`, `[${new Date().toISOString()}] Status: ${selectedAgent.status}`, `[${new Date().toISOString()}] Memory usage: 45MB`, `[${new Date().toISOString()}] CPU usage: 12%`, `[${new Date().toISOString()}] Network requests: 23`, `[${new Date().toISOString()}] Last heartbeat: ${selectedAgent.lastUpdate}`] as log}
              <div class="mb-1">{log}</div>
            {/each}
            <div class="text-yellow-400 animate-pulse">
              $ Waiting for next command...
            </div>
          </div>
          <div class="mt-4 grid grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-lg font-semibold text-gray-900">
                45MB
              </div>
              <div class="text-sm text-gray-600">
                Memory Usage
              </div>
            </div>
            <div class="text-center">
              <div class="text-lg font-semibold text-gray-900">
                12%
              </div>
              <div class="text-sm text-gray-600">CPU Usage</div>
            </div>
            <div class="text-center">
              <div class="text-lg font-semibold text-gray-900">
                23
              </div>
              <div class="text-sm text-gray-600">
                Network Requests
              </div>
            </div>
          </div>
        </div>
      {:else if testingStarted && agentInstances.length > 0}
        {#each agentInstances as agent}
          <button
                  class="w-full text-left"
                  onclick={() => {
                            selectedAgent = agent;
                        }}
          >
            <div
                    class="flex items-center space-x-3 p-3 bg-white/60 hover:bg-blue-50 rounded-xl border border-white/40 transition-all"
            >
              <div
                      class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
              ></div>
              <div class="flex-1">
                <p
                        class="text-sm font-semibold text-gray-900 flex items-center gap-2"
                >
                  {agentToHumanFriendlyName(agent.name)}
                  <span
                          class="text-xs px-2 py-0.5 rounded-full {agent.status ===
                                        'completed'
                                            ? 'bg-green-100 text-green-700'
                                            : agent.status === 'error'
                                              ? 'bg-red-100 text-red-700'
                                              : 'bg-blue-100 text-blue-700'}"
                  >
                                        {agent.status}
                                    </span>
                </p>
                <p class="text-xs text-gray-600 truncate">
                  {agent.title || agent.action}
                </p>
              </div>
              <span class="text-xs text-gray-500"
              >{agent.lastUpdate}</span
              >
            </div>
          </button>
        {/each}
      {:else}
        <p class="text-gray-500 text-center py-4">{testingStarted ?
            "Agents are working..." : "No active testing"}</p>
      {/if}
    </div>
  </Card>
</div>
