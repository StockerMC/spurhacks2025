<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import Button from "$lib/components/Button.svelte";
    import { onMount } from "svelte";
    import CatBox from "$lib/images/cat_box.png";
    import { createClient } from "@supabase/supabase-js";
    import { goto } from "$app/navigation";
    import { page } from '$app/state';
    // Import section components
    import Overview from './overview/+page.svelte';
    import Live from './live/+page.svelte';
    import Results from './results/+page.svelte';
    import Summary from './summary/+page.svelte';
    import PersonaControl from './persona/+page.svelte';

    let projectId = page.params.id;
    console.log(projectId);

    let activeSection = $state('overview');
    let sidebarCollapsed = $state(false);
    let selectedAgent = $state(null);
    let mounted = $state(false);
    let testingStarted = $state(false);
    let startTime = $state(null);
    let elapsedTime = $state('0m 0s');

    // Simplified project data
    let projectData = $state({
        name: "",
        url: "",
        status: "",
        activeAgents: 0,
        totalTests: 0,
        issuesFound: 0,
        uptime: "",
        estimatedCompletion: ""
    });

    const startTesting = () => {
        console.log("Starting testing...");
        testingStarted = true;
        startTime = Date.now();
        projectData.status = "running";
        const personalities = ['hacker', 'geek', 'accessibility cop', 'boomer'];
        const testPersonality = async (personality: string) => {
            // Simulate starting a test with the given personality
            // console.log(`Starting test with ${personality} personality...`);
            // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async operation
            // console.log(`${personality} test started.`);
            try {
                const response = await fetch(`https://spurhacks2025-430215758629.us-central1.run.app/test`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ personality, projectId, url: projectData.url })
                });
                console.log(`Response from test start: ${await response.text()}`);
            } catch (error) {
                console.error(`Error starting test with ${personality} personality:`, error);
            }
        }
        for (const personality of personalities) {
            testPersonality(personality);
        }
    }

    // Fetch project data from Supabase on mount
    onMount(async () => {
        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .eq("id", projectId)
            .single();

        if (data) {
            projectData = {
                name: data?.name,
                url: data?.url,
                status: data?.status,
                activeAgents: data?.active_agents ?? 0,
                totalTests: data?.total_tests ?? 0,
                issuesFound: data?.issues_found ?? 0,
                uptime: data?.uptime ?? "",
                estimatedCompletion: data?.estimated_completion ?? ""
            };
        }

        // Fetch agentInstances for this project
        const { data: agentData, error: agentError } = await supabase
            .from('actions')
            .select('*')
            .eq('project_id', projectId);
        if (agentData) agentInstances = agentData;

        // Subscribe to real-time changes for this project's actions
        const channel = supabase.channel('actions-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'actions', filter: `project_id=eq.${projectId}` },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        agentInstances = [...agentInstances, payload.new];
                    } else if (payload.eventType === 'UPDATE') {
                        agentInstances = agentInstances.map(a => a.id === payload.new.id ? payload.new : a);
                    } else if (payload.eventType === 'DELETE') {
                        agentInstances = agentInstances.filter(a => a.id !== payload.old.id);
                    }
                }
            )
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    });

    // Agent instances: fetch from Supabase actions table for this project
    let agentInstances = $state([]);

    // Persona configurations
    let personaConfig = $state({
        "The Hacker": { count: 0, active: false },
        "Mobile Sarah": { count: 0, active: false },
        "Grandpa Joe": { count: 0, active: false },
        "Power User": { count: 0, active: false },
        "Skeptical Sam": { count: 0, active: false },
        "Accessibility Ana": { count: 0, active: false }
    });

    // New DB data structure for results
    let testResults = $state([
        {
            id: 1,
            agent: "The Hacker",
            page: "/login",
            verdict: "fail",
            issues: ["SQL injection vulnerability found", "Weak password validation"],
            recommendations: ["Implement parameterized queries", "Add stronger password requirements"],
            summary: "Critical security vulnerabilities detected in login system"
        },
        {
            id: 2,
            agent: "Mobile Sarah",
            page: "/checkout",
            verdict: "partial",
            issues: ["Button too small on mobile", "Form validation unclear"],
            recommendations: ["Increase button size for touch targets", "Improve error message clarity"],
            summary: "Mobile usability issues affecting checkout completion"
        },
        {
            id: 3,
            agent: "Power User",
            page: "/dashboard",
            verdict: "pass",
            issues: [],
            recommendations: ["Consider adding keyboard shortcuts", "Add bulk actions"],
            summary: "Dashboard performs well with minor enhancement opportunities"
        }
    ]);

    // Updated sidebar items
    const sidebarItems = [
        { id: 'overview', label: 'Project Overview', icon: '', badge: null },
        { id: 'live', label: 'Live Updates', icon: '', badge: null },
        { id: 'results', label: 'Results', icon: '', badge: testResults.length },
        { id: 'summary', label: 'Summary', icon: '', badge: null },
        { id: 'settings', label: 'Persona Control', icon: '', badge: null }
    ];

    const updatePersonaCount = (persona: string, change: number) => {
        const newCount = Math.max(0, personaConfig[persona].count + change);
        personaConfig[persona].count = newCount;
        personaConfig[persona].active = newCount > 0;
    };

    // const startTesting = () => {
        // testingStarted = true;
        // startTime = Date.now();
        // projectData.status = "running";

    //     // Start some default agents
    //     personaConfig["The Hacker"].count = 2;
    //     personaConfig["The Hacker"].active = true;
    //     personaConfig["Mobile Sarah"].count = 2;
    //     personaConfig["Mobile Sarah"].active = true;
    //     personaConfig["Power User"].count = 1;
    //     personaConfig["Power User"].active = true;
    // };

    const stopAllTests = () => {
        testingStarted = false;
        startTime = null;
        elapsedTime = '0m 0s';
        projectData.status = "ready";

        Object.keys(personaConfig).forEach(persona => {
            personaConfig[persona].count = 0;
            personaConfig[persona].active = false;
        });
    };

    // Update elapsed time
    let timeInterval;
    $effect(() => {
        if (testingStarted && startTime) {
            timeInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const minutes = Math.floor(elapsed / 60000);
                const seconds = Math.floor((elapsed % 60000) / 1000);
                elapsedTime = `${minutes}m ${seconds}s`;
                projectData.uptime = elapsedTime;
            }, 1000);
        } else {
            if (timeInterval) {
                clearInterval(timeInterval);
            }
        }

        return () => {
            if (timeInterval) {
                clearInterval(timeInterval);
            }
        };
    });

    onMount(() => {
        mounted = true;
        let res = supabase
            .from("projects")
            .select("*");
        res.then(data => {
            projectsList = data.data;
        });
    });

    const supabase = createClient(
        "https://ttnxgveqyvtsjlwvpecl.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0bnhndmVxeXZ0c2psd3ZwZWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NDUwNzgsImV4cCI6MjA2NjEyMTA3OH0.EkiiotOoeCCpt5kY2_oSVVTCm_7M9IXoNWUt5O8WiwQ"
    );

    let projectsList: any = $state([]);

    const createNewProject = () => {
        goto("/dashboard/newproject");
    };

    const getProgressPercentage = (createdAt: string) => {
        return Math.min(100, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000));
    };
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<!-- Background Effects -->
<div class="fixed inset-0 overflow-hidden pointer-events-none">
    <div class="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-300/40 to-purple-300/30 rounded-full blur-3xl"></div>
    <div class="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-pink-300/35 to-blue-300/25 rounded-full blur-3xl"></div>
    <div class="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-300/30 to-pink-300/35 rounded-full blur-3xl"></div>
</div>

<div class="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 font-inter flex">
    <!-- Sidebar -->
    <aside class="bg-white/20 backdrop-blur-md border-r border-white/40 {sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 flex flex-col relative z-10">
        <!-- Header -->
        <div class="p-4 border-b border-white/30">
            <div class="flex items-center justify-between">
                {#if !sidebarCollapsed}
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 border rounded-xl flex items-center justify-center">
                            <img src={CatBox || "/placeholder.svg"} alt="Cat Box Logo" class="w-8 h-8"/>
                        </div>
                        <div>
                            <h1 class="font-semibold text-gray-900 text-sm">Testing Dashboard</h1>
                            <p class="text-xs text-gray-600">Live Agent Control</p>
                        </div>
                    </div>
                {/if}
                <button
                        class="p-1 hover:bg-white/20 rounded-md transition-colors"
                        onclick={() => sidebarCollapsed = !sidebarCollapsed}
                >
                    <span class="text-gray-600">{sidebarCollapsed ? '→' : '←'}</span>
                </button>
            </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-2">
            <ul class="space-y-1">
                {#each sidebarItems as item}
                    <li>
                        <button
                                class="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-left transition-all duration-200 {activeSection === item.id ? 'bg-white/30 text-[#6DBDD5] border border-white/40 shadow-lg' : 'text-gray-700 hover:bg-white/20'}"
                                onclick={() => activeSection = item.id}
                        >
                            <span class="text-lg">{item.icon}</span>
                            {#if !sidebarCollapsed}
                                <span class="font-medium text-sm flex-1">{item.label}</span>
                                {#if item.badge}
                                    <span class="bg-white/30 text-gray-700 text-xs px-2 py-1 rounded-full font-medium border border-white/40">
                                        {item.badge}
                                    </span>
                                {/if}
                            {/if}
                        </button>
                    </li>
                {/each}
            </ul>
        </nav>

        <!-- Footer Controls -->
        <div class="p-4 border-t border-white/30">
            {#if !sidebarCollapsed}
                <div class="space-y-2">
                    <Button variant="primary" size="sm" onclick={stopAllTests}>
                        Stop All Tests
                    </Button>
                    <Button variant="outline" size="sm">
                        Settings
                    </Button>
                </div>
            {:else}
                <div class="space-y-2">
                    <Button variant="primary" size="sm" onclick={stopAllTests}>Stop</Button>
                    <Button variant="outline" size="sm">Set</Button>
                </div>
            {/if}
        </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto relative z-10">
        <!-- Top Bar -->
        <header class="bg-white/20 backdrop-blur-md border-b border-white/40 px-6 py-4">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">{projectData.name}</h2>
                    <div class="flex items-center space-x-4 mt-1">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border {projectData.status === 'running' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}">
                            {projectData.status.toUpperCase()}
                        </span>
                        {#if testingStarted}
                            <span class="text-sm text-gray-600">Elapsed: {elapsedTime}</span>
                        {/if}
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <Button variant="outline" size="sm">Analytics</Button>
                    <Button variant="outline" size="sm">Refresh</Button>
                    <Button variant="primary" size="sm" onclick={() => activeSection = 'settings'}>Manage Agents</Button>
                </div>
            </div>
        </header>

        <!-- Content Area -->
        <div class="p-6">
            {#if activeSection === 'overview'}
                <Overview
                        {testingStarted}
                        {elapsedTime}
                        {testResults}
                        {agentInstances}
                        {startTesting}
                        {stopAllTests}
                />
            {:else if activeSection === 'live'}
                <Live
                        {agentInstances}
                        bind:selectedAgent
                />
            {:else if activeSection === 'results'}
                <Results
                        {testResults}
                />
            {:else if activeSection === 'summary'}
                <Summary
                        {testResults}
                />
            {:else if activeSection === 'settings'}
                <PersonaControl
                        {personaConfig}
                        {updatePersonaCount}
                        {stopAllTests}
                />
            {/if}
        </div>
    </main>
</div>

<style>
    .font-inter {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
</style>
