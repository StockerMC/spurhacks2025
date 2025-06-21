<script lang="ts">
    import { onMount } from 'svelte';
    import Button from '$lib/Components/Button.svelte';
    let mounted = $state(false);

    onMount(() => {
        mounted = true;
    });

    const projects = [
        {
            id: 1,
            name: "E-commerce Platform",
            description: "Testing checkout flow and payment security",
            status: "active",
            testersActive: 12,
            totalTests: 847,
            lastActivity: "2 hours ago",
            progress: 75,
            color: "from-blue-500 to-cyan-500",
            issues: 3
        },
        {
            id: 2,
            name: "Banking Mobile App",
            description: "Security penetration testing and UX analysis",
            status: "completed",
            testersActive: 0,
            totalTests: 1203,
            lastActivity: "1 day ago",
            progress: 100,
            color: "from-green-500 to-emerald-500",
            issues: 0
        },
        {
            id: 3,
            name: "SaaS Dashboard",
            description: "User experience testing for new features",
            status: "paused",
            testersActive: 0,
            totalTests: 234,
            lastActivity: "3 days ago",
            progress: 45,
            color: "from-orange-500 to-red-500",
            issues: 7
        },
        {
            id: 4,
            name: "Healthcare Portal",
            description: "Accessibility and compliance testing",
            status: "active",
            testersActive: 8,
            totalTests: 567,
            lastActivity: "30 minutes ago",
            progress: 60,
            color: "from-purple-500 to-pink-500",
            issues: 2
        },
        {
            id: 5,
            name: "Learning Platform",
            description: "Cross-browser compatibility testing",
            status: "active",
            testersActive: 15,
            totalTests: 923,
            lastActivity: "1 hour ago",
            progress: 85,
            color: "from-indigo-500 to-blue-500",
            issues: 1
        },
        {
            id: 6,
            name: "Travel Booking Site",
            description: "Load testing and performance optimization",
            status: "completed",
            testersActive: 0,
            totalTests: 1456,
            lastActivity: "5 days ago",
            progress: 100,
            color: "from-teal-500 to-green-500",
            issues: 0
        }
    ];

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'active': return 'bg-green-100 text-green-700 border-green-200';
            case 'completed': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'paused': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const createNewProject = () => {
        console.log('Creating new project...');
    };
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen bg-gray-50 font-inter">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div class="px-6 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                        <span class="text-white font-bold text-lg">LT</span>
                    </div>
                    <div>
                        <h1 class="text-2xl font-bold text-gray-900">Testing Dashboard</h1>
                        <p class="text-sm text-gray-500">Manage your testing projects</p>
                    </div>
                </div>

                <div class="flex items-center space-x-4">
                    <div class="hidden md:flex items-center space-x-6 text-sm">
                        <div class="text-center">
                            <div class="font-semibold text-gray-900">6</div>
                            <div class="text-gray-500">Active Projects</div>
                        </div>
                        <div class="text-center">
                            <div class="font-semibold text-gray-900">35</div>
                            <div class="text-gray-500">Active Testers</div>
                        </div>
                        <div class="text-center">
                            <div class="font-semibold text-gray-900">5,230</div>
                            <div class="text-gray-500">Total Tests</div>
                        </div>
                    </div>

                    <div class="flex items-center space-x-3">
                        <Button variant="outline" size="sm">
                            <span class="text-lg mr-2">📊</span>
                            Analytics
                        </Button>
                        <Button variant="outline" size="sm">
                            <span class="text-lg mr-2">⚙️</span>
                            Settings
                        </Button>
                        <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span class="text-sm font-medium text-gray-700">JD</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="p-6">
        <div class="max-w-7xl mx-auto">
            <!-- Page Header -->
            <div class="mb-8">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-3xl font-bold text-gray-900 mb-2">Your Projects</h2>
                        <p class="text-gray-600">Monitor and manage your testing projects</p>
                    </div>
                    <div class="flex items-center space-x-3">
                        <Button variant="outline">
                            <span class="mr-2">🔍</span>
                            Search
                        </Button>
                        <Button variant="outline">
                            <span class="mr-2">📋</span>
                            Filter
                        </Button>
                    </div>
                </div>
            </div>

            <!-- Projects Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- New Project Card -->
                <button
                        class="group relative bg-white rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-all duration-300 p-8 flex flex-col items-center justify-center min-h-[320px] hover:shadow-lg"
                        onclick={createNewProject}
                >
                    <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <span class="text-white text-2xl font-bold">+</span>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">New Project</h3>
                    <p class="text-gray-500 text-center">Start testing a new application with our AI-powered testers</p>
                    <div class="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span class="text-blue-600 font-medium">Click to create →</span>
                    </div>
                </button>

                <!-- Existing Project Cards -->
                {#each projects as project}
                    <div class="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
                        <!-- Project Header -->
                        <div class="bg-gradient-to-r {project.color} p-6 text-white relative">
                            <div class="flex items-start justify-between mb-4">
                                <div class="flex-1">
                                    <h3 class="text-xl font-semibold mb-2 line-clamp-1">{project.name}</h3>
                                    <p class="text-white/90 text-sm line-clamp-2">{project.description}</p>
                                </div>
                                <span class="px-2 py-1 bg-white/20 rounded-lg text-xs font-medium capitalize backdrop-blur-sm">
                  {project.status}
                </span>
                            </div>

                            <!-- Progress Bar -->
                            <div class="mb-2">
                                <div class="flex justify-between text-sm mb-1">
                                    <span class="text-white/90">Progress</span>
                                    <span class="font-medium">{project.progress}%</span>
                                </div>
                                <div class="w-full bg-white/20 rounded-full h-2">
                                    <div class="bg-white rounded-full h-2 transition-all duration-500" style="width: {project.progress}%"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Project Stats -->
                        <div class="p-6">
                            <div class="grid grid-cols-2 gap-4 mb-6">
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-gray-900">{project.testersActive}</div>
                                    <div class="text-xs text-gray-500">Active Testers</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-2xl font-bold text-gray-900">{project.totalTests.toLocaleString()}</div>
                                    <div class="text-xs text-gray-500">Total Tests</div>
                                </div>
                            </div>

                            <!-- Issues & Last Activity -->
                            <div class="space-y-3 mb-6">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-600">Issues Found</span>
                                    <span class="px-2 py-1 rounded-full text-xs font-medium {project.issues > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">
                    {project.issues} {project.issues === 1 ? 'issue' : 'issues'}
                  </span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm text-gray-600">Last Activity</span>
                                    <span class="text-sm font-medium text-gray-900">{project.lastActivity}</span>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="flex space-x-2">
                                <Button variant="primary" size="sm" class="flex-1">
                                    View Details
                                </Button>
                                <Button variant="outline" size="sm">
                                    <span class="text-lg">⚙️</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>

            <!-- Quick Stats -->
            <div class="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div class="bg-white rounded-xl p-6 border border-gray-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Total Projects</p>
                            <p class="text-2xl font-bold text-gray-900">{projects.length}</p>
                        </div>
                        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span class="text-xl">📁</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl p-6 border border-gray-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Active Tests</p>
                            <p class="text-2xl font-bold text-gray-900">{projects.filter(p => p.status === 'active').length}</p>
                        </div>
                        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <span class="text-xl">⚡</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl p-6 border border-gray-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Issues Found</p>
                            <p class="text-2xl font-bold text-gray-900">{projects.reduce((sum, p) => sum + p.issues, 0)}</p>
                        </div>
                        <div class="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                            <span class="text-xl">🚨</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl p-6 border border-gray-200">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm text-gray-600">Completed</p>
                            <p class="text-2xl font-bold text-gray-900">{projects.filter(p => p.status === 'completed').length}</p>
                        </div>
                        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <span class="text-xl">✅</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</div>

<style>
    .font-inter {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .line-clamp-1 {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>
