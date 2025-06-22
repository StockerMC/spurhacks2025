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
      {#each media as item}
        <img src={item.url} alt={item.name} class="w-full h-auto rounded-lg shadow-md"/>
      {/each}
    </div>
  </Card>
</div>
