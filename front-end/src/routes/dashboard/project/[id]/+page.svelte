<script lang="ts">
    // TODO: custom URL based on project name or ID
    import Card from "$lib/components/Card.svelte";
    import Button from "$lib/components/Button.svelte";
    import { onMount } from "svelte";
    import CatBox from "$lib/images/cat_box.png";
    import { createClient } from "@supabase/supabase-js";
    import { goto } from "$app/navigation";
    import { page } from '$app/state';


    let projectId = page.params.id;
    console.log(projectId);


    let activeSection = $state('overview');
    let sidebarCollapsed = $state(false);
    let selectedAgent = $state(null);
    let mounted = $state(false);



    // Mock data for demonstration
    let projectData = $state({
        name: "E-commerce Platform Test",
        status: "running",
        activeAgents: 8,
        totalTests: 1247,
        issuesFound: 12,
        uptime: "2h 34m",
        estimatedCompletion: "45 minutes"
    });

    // Agent instances with unique IDs
    let agentInstances = $state([
        { id: "hack_001", name: "The Hacker", action: "Testing SQL injection on login form", status: "active", lastUpdate: "2s ago", hash: "a7f3d9e2" },
        { id: "hack_002", name: "The Hacker", action: "Scanning for XSS vulnerabilities", status: "active", lastUpdate: "8s ago", hash: "b2e8c4f1" },
        { id: "mobile_001", name: "Mobile Sarah", action: "Checking responsive design on checkout", status: "active", lastUpdate: "5s ago", hash: "c9d1a5b7" },
        { id: "mobile_002", name: "Mobile Sarah", action: "Testing touch interactions", status: "active", lastUpdate: "12s ago", hash: "d4f7e2a9" },
        { id: "grandpa_001", name: "Grandpa Joe", action: "Struggling with navigation menu", status: "confused", lastUpdate: "12s ago", hash: "e8b3f6c2" },
        { id: "power_001", name: "Power User", action: "Stress testing search functionality", status: "active", lastUpdate: "8s ago", hash: "f1c5d8e4" },
        { id: "power_002", name: "Power User", action: "Testing keyboard shortcuts", status: "active", lastUpdate: "15s ago", hash: "g6a2b9f3" },
        { id: "power_003", name: "Power User", action: "Exploring advanced features", status: "active", lastUpdate: "3s ago", hash: "h3e7c1d5" }
    ]);

    // Persona configurations
    let personaConfig = $state({
        "The Hacker": { count: 2, active: true },
        "Mobile Sarah": { count: 2, active: true },
        "Grandpa Joe": { count: 1, active: true },
        "Power User": { count: 3, active: true },
        "Skeptical Sam": { count: 0, active: false },
        "Accessibility Ana": { count: 0, active: false }
    });

    let criticalIssues = $state([
        { severity: "critical", title: "SQL Injection vulnerability found", agent: "The Hacker #a7f3d9e2", page: "/login" },
        { severity: "high", title: "Mobile checkout flow broken", agent: "Mobile Sarah #c9d1a5b7", page: "/checkout" },
        { severity: "medium", title: "Navigation confusing for seniors", agent: "Grandpa Joe #e8b3f6c2", page: "/dashboard" }
    ]);

    let feedbackItems = $state([
        { id: 1, title: "Review login form accessibility", priority: "high", completed: false, assignee: "Dev Team" },
        { id: 2, title: "Fix mobile responsive issues on checkout", priority: "critical", completed: false, assignee: "Frontend" },
        { id: 3, title: "Implement better error messages", priority: "medium", completed: true, assignee: "UX Team" },
        { id: 4, title: "Add loading states for slow connections", priority: "low", completed: false, assignee: "Backend" }
    ]);

    const sidebarItems = [
        { id: 'overview', label: 'Project Overview', icon: '📊', badge: null },
        { id: 'agents', label: 'Agent Intelligence', icon: '🧠', badge: projectData.activeAgents },
        { id: 'issues', label: 'Issues + Insights', icon: '🚨', badge: projectData.issuesFound },
        { id: 'feedback', label: 'Feedback & Tasks', icon: '💬', badge: feedbackItems.filter(f => !f.completed).length },
        { id: 'metrics', label: 'Metrics', icon: '📈', badge: null },
        { id: 'settings', label: 'Persona Control', icon: '🧬', badge: null },
        { id: 'export', label: 'Export / Controls', icon: '📤', badge: null }
    ];

    const getSeverityColor = (severity: string) => {
        switch(severity) {
            case 'critical': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch(priority) {
            case 'critical': return 'bg-purple-100 text-purple-800';
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-orange-100 text-orange-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const generateDockerLog = (agent) => {
        return [
            `[${new Date().toISOString()}] Starting agent container ${agent.id}`,
            `[${new Date().toISOString()}] Loading persona: ${agent.name}`,
            `[${new Date().toISOString()}] Connecting to target: https://example.com`,
            `[${new Date().toISOString()}] Executing: ${agent.action}`,
            `[${new Date().toISOString()}] Status: ${agent.status}`,
            `[${new Date().toISOString()}] Memory usage: 45MB`,
            `[${new Date().toISOString()}] CPU usage: 12%`,
            `[${new Date().toISOString()}] Network requests: 23`,
            `[${new Date().toISOString()}] Last heartbeat: ${agent.lastUpdate}`
        ];
    };

    const updatePersonaCount = (persona: string, change: number) => {
        const newCount = Math.max(0, personaConfig[persona].count + change);
        personaConfig[persona].count = newCount;
        personaConfig[persona].active = newCount > 0;

        // Update total active agents
        projectData.activeAgents = Object.values(personaConfig).reduce((sum, config) => sum + config.count, 0);
    };

    const stopAllTests = () => {
        Object.keys(personaConfig).forEach(persona => {
            personaConfig[persona].count = 0;
            personaConfig[persona].active = false;
        });
        projectData.activeAgents = 0;
        projectData.status = "stopped";
    };

    onMount(() => {
        mounted = true;
        let res = supabase
            .from("projects")
            .select("*");
        res.then(data => {
            projectsList = data.data;
        });
    });

    // Supabase real-time agentInstances for this project
    onMount(() => {
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
        // Fetch initial agentInstances for this project
        supabase.from('actions').select('*').eq('project_id', projectId).then(({ data }) => {
            if (data) agentInstances = data;
        });
        return () => {
            supabase.removeChannel(channel);
        };
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
                            <img src={CatBox} alt="Cat Box Logo" class="w-8 h-8"/>
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
                        🛑 Stop All Tests
                    </Button>
                    <Button variant="outline" size="sm">
                        ⚙️ Settings
                    </Button>
                </div>
            {:else}
                <div class="space-y-2">
                    <Button variant="primary" size="sm" onclick={stopAllTests}>🛑</Button>
                    <Button variant="outline" size="sm">⚙️</Button>
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
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border {projectData.status === 'running' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}">
                            ● {projectData.status.toUpperCase()}
                        </span>
                        <span class="text-sm text-gray-600">Runtime: {projectData.uptime}</span>
                        <span class="text-sm text-gray-600">{projectData.activeAgents} agents active</span>
                        {#if projectData.status === 'running'}
                            <span class="text-sm text-gray-600">ETA: {projectData.estimatedCompletion}</span>
                        {/if}
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <Button variant="outline" size="sm">📊 Analytics</Button>
                    <Button variant="outline" size="sm">🔄 Refresh</Button>
                    <Button variant="primary" size="sm" onclick={() => activeSection = 'settings'}>+ Manage Agents</Button>
                </div>
            </div>
        </header>

        <!-- Content Area -->
        <div class="p-6">

            <!-- Project Overview -->
            {#if activeSection === 'overview'}
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-[#6DBDD5] mb-2">{projectData.activeAgents}</div>
                            <div class="text-sm text-gray-600">Active Agents</div>
                        </div>
                    </Card>
                    <Card>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-green-600 mb-2">{projectData.totalTests.toLocaleString()}</div>
                            <div class="text-sm text-gray-600">Tests Completed</div>
                        </div>
                    </Card>
                    <Card>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-red-600 mb-2">{projectData.issuesFound}</div>
                            <div class="text-sm text-gray-600">Issues Found</div>
                        </div>
                    </Card>
                    <Card>
                        <div class="text-center">
                            <div class="text-3xl font-bold text-purple-600 mb-2">94%</div>
                            <div class="text-sm text-gray-600">Success Rate</div>
                        </div>
                    </Card>
                </div>

                {#if projectData.status === 'running'}
                    <div class="mb-6">
                        <Card>
                            <div class="flex items-center justify-between">
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-900">⏱️ Estimated Completion</h3>
                                    <p class="text-gray-600">Tests will complete in approximately <strong>{projectData.estimatedCompletion}</strong></p>
                                </div>
                                <div class="text-right">
                                    <div class="text-2xl font-bold text-[#6DBDD5]">{projectData.estimatedCompletion}</div>
                                    <div class="text-sm text-gray-500">remaining</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                {/if}

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">🚨 Critical Issues</h3>
                        <div class="space-y-3">
                            {#each criticalIssues.slice(0, 3) as issue}
                                <div class="flex items-start space-x-3 p-3 bg-white/30 rounded-xl border border-white/40">
                                    <span class="px-2 py-1 rounded-full text-xs font-medium {getSeverityColor(issue.severity)}">
                                        {issue.severity.toUpperCase()}
                                    </span>
                                    <div class="flex-1">
                                        <p class="text-sm font-medium text-gray-900">{issue.title}</p>
                                        <p class="text-xs text-gray-600">Found by {issue.agent} on {issue.page}</p>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </Card>

                    <Card>
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">🧠 Agent Activity</h3>
                        <div class="space-y-3">
                            {#each agentInstances.slice(0, 4) as agent}
                                <div class="flex items-center space-x-3">
                                    <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <div class="flex-1">
                                        <p class="text-sm font-medium text-gray-900">{agent.name} #{agent.hash}</p>
                                        <p class="text-xs text-gray-600">{agent.action}</p>
                                    </div>
                                    <span class="text-xs text-gray-500">{agent.lastUpdate}</span>
                                </div>
                            {/each}
                        </div>
                    </Card>
                </div>
            {/if}

            <!-- Agent Intelligence Feed -->
            {#if activeSection === 'agents'}
                {#if selectedAgent}
                    <!-- Agent Detail View -->
                    <Card>
                        <div class="flex items-center justify-between mb-6">
                            <div class="flex items-center space-x-3">
                                <Button variant="outline" size="sm" onclick={() => selectedAgent = null}>← Back</Button>
                                <h3 class="text-xl font-semibold text-gray-900">🐳 Container: {selectedAgent.name} #{selectedAgent.hash}</h3>
                                <span class="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full border border-green-200">{selectedAgent.status}</span>
                            </div>
                            <Button variant="outline" size="sm">🛑 Stop Container</Button>
                        </div>

                        <div class="bg-black text-green-400 p-4 rounded-xl font-mono text-sm overflow-x-auto border border-gray-600">
                            <div class="mb-2 text-gray-400">Docker Container Logs - {selectedAgent.id}</div>
                            {#each generateDockerLog(selectedAgent) as log}
                                <div class="mb-1">{log}</div>
                            {/each}
                            <div class="text-yellow-400 animate-pulse">$ Waiting for next command...</div>
                        </div>

                        <div class="mt-4 grid grid-cols-3 gap-4">
                            <div class="text-center">
                                <div class="text-lg font-semibold text-gray-900">45MB</div>
                                <div class="text-sm text-gray-600">Memory Usage</div>
                            </div>
                            <div class="text-center">
                                <div class="text-lg font-semibold text-gray-900">12%</div>
                                <div class="text-sm text-gray-600">CPU Usage</div>
                            </div>
                            <div class="text-center">
                                <div class="text-lg font-semibold text-gray-900">23</div>
                                <div class="text-sm text-gray-600">Network Requests</div>
                            </div>
                        </div>
                    </Card>
                {:else}
                    <!-- Agent List View -->
                    <Card>
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-xl font-semibold text-gray-900">🧠 Live Agent Intelligence Feed</h3>
                            <Button variant="outline" size="sm">🔄 Auto-refresh: ON</Button>
                        </div>

                        <div class="space-y-4">
                            {#each agentInstances as agent}
                                <button
                                        class="w-full border border-white/40 rounded-xl p-4 hover:bg-white/20 transition-all duration-200 text-left backdrop-blur-sm"
                                        onclick={() => selectedAgent = agent}
                                >
                                    <div class="flex items-center justify-between mb-2">
                                        <div class="flex items-center space-x-3">
                                            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                            <span class="font-semibold text-gray-900">{agent.name} #{agent.hash}</span>
                                            <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-200">{agent.status}</span>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            <span class="text-sm text-gray-600">{agent.lastUpdate}</span>
                                            <span class="text-gray-400">→</span>
                                        </div>
                                    </div>
                                    <p class="text-gray-700">{agent.action}</p>
                                </button>
                            {/each}
                        </div>
                    </Card>
                {/if}
            {/if}

            <!-- Issues + Insights -->
            {#if activeSection === 'issues'}
                <div class="space-y-6">
                    <Card>
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-xl font-semibold text-gray-900">🚨 Issues + Insights</h3>
                            <div class="flex space-x-2">
                                <Button variant="outline" size="sm">Filter</Button>
                                <Button variant="outline" size="sm">Export</Button>
                            </div>
                        </div>

                        <div class="space-y-4">
                            {#each criticalIssues as issue}
                                <div class="border border-white/40 rounded-xl p-4 bg-white/10 backdrop-blur-sm">
                                    <div class="flex items-start justify-between mb-3">
                                        <div class="flex items-center space-x-3">
                                            <span class="px-3 py-1 rounded-full text-xs font-medium {getSeverityColor(issue.severity)}">
                                                {issue.severity.toUpperCase()}
                                            </span>
                                            <h4 class="font-semibold text-gray-900">{issue.title}</h4>
                                        </div>
                                        <Button variant="outline" size="sm">Fix</Button>
                                    </div>
                                    <div class="text-sm text-gray-600">
                                        <p>Discovered by <strong>{issue.agent}</strong> on page <code class="bg-white/30 px-2 py-1 rounded border border-white/40">{issue.page}</code></p>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </Card>
                </div>
            {/if}

            <!-- Feedback & Tasks -->
            {#if activeSection === 'feedback'}
                <Card>
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-semibold text-gray-900">💬 Feedback & Action Items</h3>
                        <Button variant="primary" size="sm">+ Add Task</Button>
                    </div>

                    <div class="space-y-3">
                        {#each feedbackItems as item}
                            <div class="flex items-center space-x-4 p-4 border border-white/40 rounded-xl {item.completed ? 'bg-white/10' : 'bg-white/20'} backdrop-blur-sm">
                                <input
                                        type="checkbox"
                                        bind:checked={item.completed}
                                        class="w-4 h-4 text-[#6DBDD5] rounded focus:ring-[#6DBDD5]"
                                />
                                <div class="flex-1">
                                    <h4 class="font-medium text-gray-900 {item.completed ? 'line-through text-gray-600' : ''}">{item.title}</h4>
                                    <p class="text-sm text-gray-600">Assigned to: {item.assignee}</p>
                                </div>
                                <span class="px-2 py-1 rounded-full text-xs font-medium {getPriorityColor(item.priority)}">
                                    {item.priority.toUpperCase()}
                                </span>
                            </div>
                        {/each}
                    </div>
                </Card>
            {/if}

            <!-- Metrics -->
            {#if activeSection === 'metrics'}
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">📈 Performance Metrics</h3>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Success Rate</span>
                                <span class="font-semibold text-green-600">94.2%</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Error Rate</span>
                                <span class="font-semibold text-red-600">5.8%</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Security Hits</span>
                                <span class="font-semibold text-orange-600">3</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-gray-600">Avg Response Time</span>
                                <span class="font-semibold text-[#6DBDD5]">1.2s</span>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">🎯 Agent Performance</h3>
                        <div class="space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-600">The Hacker (2 instances)</span>
                                <div class="flex items-center space-x-2">
                                    <div class="w-20 bg-white/30 rounded-full h-2 border border-white/40">
                                        <div class="bg-red-500 h-2 rounded-full" style="width: 85%"></div>
                                    </div>
                                    <span class="text-xs text-gray-600">85%</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-600">Mobile Sarah (2 instances)</span>
                                <div class="flex items-center space-x-2">
                                    <div class="w-20 bg-white/30 rounded-full h-2 border border-white/40">
                                        <div class="bg-green-500 h-2 rounded-full" style="width: 92%"></div>
                                    </div>
                                    <span class="text-xs text-gray-600">92%</span>
                                </div>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-sm text-gray-600">Power User (3 instances)</span>
                                <div class="flex items-center space-x-2">
                                    <div class="w-20 bg-white/30 rounded-full h-2 border border-white/40">
                                        <div class="bg-[#6DBDD5] h-2 rounded-full" style="width: 88%"></div>
                                    </div>
                                    <span class="text-xs text-gray-600">88%</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            {/if}

            <!-- Persona Control -->
            {#if activeSection === 'settings'}
                <Card>
                    <h3 class="text-xl font-semibold text-gray-900 mb-6">🧬 Persona Control Center</h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {#each Object.entries(personaConfig) as [persona, config]}
                            <div class="border border-white/40 rounded-xl p-4 bg-white/10 backdrop-blur-sm">
                                <div class="flex items-center justify-between mb-4">
                                    <div class="flex items-center space-x-2">
                                        <span class="text-2xl">
                                            {persona === "The Hacker" ? "🔒" :
                                                persona === "Mobile Sarah" ? "📱" :
                                                    persona === "Grandpa Joe" ? "👴" :
                                                        persona === "Power User" ? "⚡" :
                                                            persona === "Skeptical Sam" ? "🤔" : "♿"}
                                        </span>
                                        <h4 class="font-semibold text-gray-900">{persona}</h4>
                                    </div>
                                    <span class="px-2 py-1 rounded-full text-xs font-medium border {config.active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}">
                                        {config.active ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </div>

                                <div class="flex items-center justify-between mb-4">
                                    <span class="text-sm text-gray-600">Instances:</span>
                                    <div class="flex items-center space-x-2">
                                        <Button variant="outline" size="sm" onclick={() => updatePersonaCount(persona, -1)}>-</Button>
                                        <span class="w-8 text-center font-semibold">{config.count}</span>
                                        <Button variant="outline" size="sm" onclick={() => updatePersonaCount(persona, 1)}>+</Button>
                                    </div>
                                </div>

                                <div class="space-y-2">
                                    {#if config.count > 0}
                                        <Button variant="outline" size="sm" class="w-full">🛑 Stop All</Button>
                                    {:else}
                                        <Button variant="primary" size="sm" class="w-full" onclick={() => updatePersonaCount(persona, 1)}>🚀 Start Testing</Button>
                                    {/if}
                                </div>
                            </div>
                        {/each}
                    </div>

                    <div class="mt-8 pt-6 border-t border-white/30">
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="font-semibold text-gray-900">Total Active Agents: {projectData.activeAgents}</h4>
                                <p class="text-sm text-gray-600">Estimated cost: $0.{(projectData.activeAgents * 12).toString().padStart(2, '0')}/hour</p>
                            </div>
                            <div class="space-x-2">
                                <Button variant="outline" onclick={stopAllTests}>🛑 Stop All Tests</Button>
                                <Button variant="primary">💾 Save Configuration</Button>
                            </div>
                        </div>
                    </div>
                </Card>
            {/if}

            <!-- Export / Controls -->
            {#if activeSection === 'export'}
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">📤 Export Options</h3>
                        <div class="space-y-3">
                            <Button variant="outline" class="w-full justify-start">📊 Export Full Report (PDF)</Button>
                            <Button variant="outline" class="w-full justify-start">📋 Export Issues (CSV)</Button>
                            <Button variant="outline" class="w-full justify-start">💬 Export Tasks (JSON)</Button>
                            <Button variant="outline" class="w-full justify-start">📈 Export Metrics (Excel)</Button>
                        </div>
                    </Card>

                    <Card>
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">🔄 Test Controls</h3>
                        <div class="space-y-3">
                            <Button variant="primary" class="w-full" onclick={() => activeSection = 'settings'}>🚀 Configure & Start Tests</Button>
                            <Button variant="outline" class="w-full">⏸️ Pause Current Tests</Button>
                            <Button variant="outline" class="w-full">🔄 Restart Failed Tests</Button>
                            <Button variant="secondary" class="w-full">📋 Clone Test Configuration</Button>
                        </div>
                    </Card>
                </div>
            {/if}

        </div>
    </main>
</div>

<style>
    .font-inter {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
</style>
