<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import Button from "$lib/components/Button.svelte";
    import { onMount } from "svelte";
    import { page } from "$app/state";
    import { createClient } from "@supabase/supabase-js";
    import Love from "$lib/images/love.png";

    interface Props {
        selectedAgent: any;
        agentInstances: any[];
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

    const agentToHumanFriendlyName = (agent) => {
        if (agent === "geek") return "Power User";
        else if (agent === "boomer") return "Grandpa Joe";
        else if (agent === "accessibility cop") return "Accessibility Officer";
        else return "The Hacker";
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

<img src={Love} alt="Love" class="h-16 mx-auto mb-4" />

<Card>
  <div class="flex items-center justify-between mb-6">
    <h3 class="text-xl font-semibold text-gray-900">Live Agent Updates</h3>
    <Button variant="outline" size="sm">Auto-refresh: ON</Button>
  </div>

  <div class="space-y-10">
    {#each actions as action}
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center space-x-3">
          {#if action.status === "success" || (action.status === "failure" && action.agent === "hacker")}
            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          {:else}
            <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          {/if}
          <span class="font-semibold text-gray-900">{agentToHumanFriendlyName(action.agent)}</span>
        </div>
      </div>
      <p class="text-gray-700">{action.finalSummary}</p>
      <hr class="text-gray-300">
    {/each}
  </div>
</Card>
