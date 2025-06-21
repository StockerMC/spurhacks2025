<script lang="ts">
    import { onMount } from 'svelte';

    let mounted = $state(false);

    onMount(() => {
        mounted = true;
    });

    const profiles = [
        {
            name: "The Hacker",
            description: "finds every vulnerability",
            icon: "🔒",
            color: "from-red-400 to-red-600",
            question: "what if I try to break this?"
        },
        {
            name: "Grandpa Joe",
            description: "represents confused users",
            icon: "👴",
            color: "from-blue-400 to-blue-600",
            question: "how do I even use this?"
        },
        {
            name: "Power User",
            description: "pushes every limit",
            icon: "⚡",
            color: "from-purple-400 to-purple-600",
            question: "can this handle my workflow?"
        },
        {
            name: "Mobile Sarah",
            description: "tests on tiny screens",
            icon: "📱",
            color: "from-green-400 to-green-600",
            question: "does this work on mobile?"
        },
        {
            name: "Skeptical Sam",
            description: "questions everything",
            icon: "🤔",
            color: "from-yellow-400 to-yellow-600",
            question: "is this actually useful?"
        },
        {
            name: "Accessibility Ana",
            description: "needs inclusive design",
            icon: "♿",
            color: "from-pink-400 to-pink-600",
            question: "can everyone use this?"
        }
    ];

    const features = [
        {
            title: "1,000 Virtual Testers",
            description: "Each with unique personalities and testing approaches",
            icon: "👥"
        },
        {
            title: "Real Conversations",
            description: "Natural language feedback, not just error logs",
            icon: "💬"
        },
        {
            title: "Security Probing",
            description: "Ethical hackers test your defenses",
            icon: "🛡️"
        },
        {
            title: "UX Reality Check",
            description: "Honest feedback about user experience",
            icon: "🎯"
        }
    ];
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen relative overflow-hidden font-inter">
    <!-- Liquid Glass Background -->
    <div class="fixed inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
        <!-- Large bubble effects - more vivid -->
        <div class="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-300/40 to-purple-300/30 rounded-full blur-3xl"></div>
        <div class="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-pink-300/35 to-blue-300/25 rounded-full blur-3xl"></div>
        <div class="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-300/30 to-pink-300/35 rounded-full blur-3xl"></div>
        <div class="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/30 to-purple-400/25 rounded-full blur-2xl"></div>
        <div class="absolute bottom-1/3 right-10 w-56 h-56 bg-gradient-to-br from-pink-400/35 to-blue-400/30 rounded-full blur-2xl"></div>

        <!-- Medium bubble effects - more vivid -->
        <div class="absolute top-1/4 left-1/2 w-48 h-48 bg-gradient-to-br from-blue-300/25 to-purple-300/20 rounded-full blur-xl"></div>
        <div class="absolute bottom-1/4 left-1/4 w-40 h-40 bg-gradient-to-br from-pink-300/30 to-blue-300/25 rounded-full blur-xl"></div>

        <!-- Small floating bubbles - more vivid -->
        <div class="absolute top-1/2 left-20 w-24 h-24 bg-gradient-to-br from-purple-400/40 to-pink-400/30 rounded-full blur-lg"></div>
        <div class="absolute top-3/4 right-1/3 w-32 h-32 bg-gradient-to-br from-blue-400/35 to-purple-400/25 rounded-full blur-lg"></div>
        <div class="absolute top-10 right-1/2 w-20 h-20 bg-gradient-to-br from-pink-400/45 to-blue-400/35 rounded-full blur-md"></div>
    </div>

    <!-- Content overlay -->
    <div class="relative z-10">
        <!-- Navigation -->
        <nav class="px-6 py-4 backdrop-blur-md bg-white/10 border-b border-white/20">
            <div class="max-w-7xl mx-auto flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span class="text-white font-medium text-sm">LT</span>
                    </div>
                    <span class="text-xl font-medium text-gray-900">LLM Tester</span>
                </div>

                <div class="hidden md:flex items-center space-x-8">
                    <a href="#features" class="text-gray-600 hover:text-gray-900 transition-colors font-medium">Features</a>
                    <a href="#how-it-works" class="text-gray-600 hover:text-gray-900 transition-colors font-medium">How it Works</a>
                    <a href="#pricing" class="text-gray-600 hover:text-gray-900 transition-colors font-medium">Pricing</a>
                </div>

                <div class="flex items-center space-x-4">
                    <button class="text-gray-600 hover:text-gray-900 transition-colors font-medium">Sign In</button>
                    <button class="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 font-medium">
                        Get Started
                    </button>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section class="px-6 py-20 md:py-32 relative">
            <!-- Hero liquid glass background - more vivid -->
            <div class="absolute inset-0 overflow-hidden">
                <div class="absolute top-10 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-500/30 to-purple-500/25 rounded-full blur-2xl"></div>
                <div class="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-br from-pink-500/25 to-blue-500/20 rounded-full blur-3xl"></div>
                <div class="absolute top-1/2 left-10 w-48 h-48 bg-gradient-to-br from-purple-500/35 to-pink-500/30 rounded-full blur-xl"></div>
                <div class="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-blue-400/40 to-purple-400/35 rounded-full blur-lg"></div>
            </div>

            <div class="max-w-7xl mx-auto text-center relative z-10">
                <div class="max-w-5xl mx-auto">
                    <h1 class="text-5xl md:text-7xl font-light text-gray-900 mb-8 leading-tight tracking-tight">
                        We simulate your first
                        <span class="font-medium bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
            1,000 users
          </span>
                        and attackers
                    </h1>

                    <p class="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed font-light max-w-4xl mx-auto">
                        so you can fix your bugs, UX, and vulnerabilities before they become real problems.
                    </p>

                    <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        <button class="bg-gradient-to-r from-blue-500 to-pink-500 text-white px-8 py-4 rounded-xl text-lg font-medium hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            Start Testing Now
                        </button>
                        <button class="border border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-medium hover:bg-white/50 backdrop-blur-sm transition-all">
                            Watch Demo
                        </button>
                    </div>
                </div>

                <!-- Hero Visual - Stacked Cards -->
                <div class="relative max-w-6xl mx-auto">
                    <!-- Main question card with cool gradient -->
                    <div class="relative mb-8">
                        <div class="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 rounded-3xl p-8 md:p-12 shadow-2xl transform rotate-1 relative z-10">
                            <div class="text-left">
                                <h3 class="text-2xl md:text-4xl font-light text-white mb-6 leading-relaxed">
                                    need someone to
                                    <span class="text-red-300 font-medium">find every bug?</span><br>
                                    <span class="text-blue-300 font-medium">test like a beginner?</span><br>
                                    <span class="text-purple-300 font-medium">push every limit?</span>
                                </h3>
                                <p class="text-xl text-slate-300 font-light">
                                    our testers have all the <span class="text-white font-medium">(virtual)</span> personalities you need. ✨
                                </p>
                            </div>
                        </div>

                        <!-- Stacked shadow card -->
                        <div class="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-500 rounded-3xl transform rotate-2 -z-10 opacity-60"></div>
                        <div class="absolute inset-0 bg-gradient-to-br from-slate-600 via-slate-500 to-slate-400 rounded-3xl transform rotate-3 -z-20 opacity-40"></div>
                    </div>

                    <!-- Character Grid -->
                    <div class="backdrop-blur-md bg-white/15 rounded-3xl border border-white/30 overflow-hidden shadow-xl transform -rotate-1">
                        <div class="p-6 md:p-8">
                            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {#each profiles as profile}
                                    <div class="relative group">
                                        <div class="backdrop-blur-sm bg-white/25 rounded-2xl p-5 border border-white/40 hover:bg-white/35 transition-all duration-300 hover:scale-105">
                                            <div class="text-2xl mb-2">{profile.icon}</div>
                                            <h4 class="font-medium text-gray-900 mb-1 text-sm">{profile.name}</h4>
                                            <p class="text-xs text-gray-700 mb-2 font-light">{profile.description}</p>

                                            <!-- Cute speech bubble -->
                                            <div class="absolute -top-3 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                                                <div class="bg-white text-gray-800 text-xs px-3 py-2 rounded-2xl whitespace-nowrap font-medium shadow-lg border border-gray-200 relative">
                                                    "{profile.question}"
                                                    <div class="absolute bottom-0 left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white transform translate-y-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section Divider -->
        <div class="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        <!-- Features Section -->
        <section id="features" class="px-6 py-20 backdrop-blur-sm bg-white/5">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
                        Comprehensive Testing Platform
                    </h2>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto font-light">
                        Our LLM agents simulate real user behavior to uncover issues before your users do
                    </p>
                </div>

                <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {#each features as feature}
                        <div class="backdrop-blur-sm bg-white/20 rounded-2xl p-8 border border-white/30 hover:bg-white/30 transition-all duration-300">
                            <div class="text-4xl mb-6">{feature.icon}</div>
                            <h3 class="text-xl font-medium text-gray-900 mb-3">{feature.title}</h3>
                            <p class="text-gray-600 font-light leading-relaxed">{feature.description}</p>
                        </div>
                    {/each}
                </div>
            </div>
        </section>

        <!-- Section Divider -->
        <div class="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        <!-- How It Works -->
        <section id="how-it-works" class="px-6 py-20">
            <div class="max-w-7xl mx-auto">
                <div class="text-center mb-16">
                    <h2 class="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
                        How It Works
                    </h2>
                    <p class="text-xl text-gray-600 font-light">
                        Three simple steps to comprehensive testing
                    </p>
                </div>

                <div class="grid md:grid-cols-3 gap-12">
                    <div class="text-center">
                        <div class="w-20 h-20 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-medium mx-auto mb-6">
                            1
                        </div>
                        <h3 class="text-2xl font-medium text-gray-900 mb-4">Upload Your Product</h3>
                        <p class="text-gray-600 font-light leading-relaxed">Share your website, app, or prototype with our platform</p>
                    </div>

                    <div class="text-center">
                        <div class="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-medium mx-auto mb-6">
                            2
                        </div>
                        <h3 class="text-2xl font-medium text-gray-900 mb-4">Choose Your Testers</h3>
                        <p class="text-gray-600 font-light leading-relaxed">Select from our diverse range of LLM-powered user personas</p>
                    </div>

                    <div class="text-center">
                        <div class="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-medium mx-auto mb-6">
                            3
                        </div>
                        <h3 class="text-2xl font-medium text-gray-900 mb-4">Get Real Feedback</h3>
                        <p class="text-gray-600 font-light leading-relaxed">Receive comprehensive insights and actionable recommendations</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section Divider -->
        <div class="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        <!-- CTA Section -->
        <section class="px-6 py-20 bg-gradient-to-r from-blue-500 to-pink-500">
            <div class="max-w-4xl mx-auto text-center">
                <h2 class="text-4xl md:text-5xl font-light text-white mb-6 tracking-tight">
                    Ready to test like the pros?
                </h2>
                <p class="text-xl text-blue-100 mb-10 font-light">
                    Join thousands of developers who ship better products with LLM Tester
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button class="bg-white text-blue-600 px-8 py-4 rounded-xl text-lg font-medium hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        Start Free Trial
                    </button>
                    <button class="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-white hover:text-blue-600 transition-colors">
                        Schedule Demo
                    </button>
                </div>
            </div>
        </section>

        <!-- Footer -->
        <footer class="px-6 py-12 bg-gray-900">
            <div class="max-w-7xl mx-auto">
                <div class="grid md:grid-cols-4 gap-8">
                    <div>
                        <div class="flex items-center space-x-3 mb-6">
                            <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <span class="text-white font-medium text-sm">LT</span>
                            </div>
                            <span class="text-xl font-medium text-white">LLM Tester</span>
                        </div>
                        <p class="text-gray-400 font-light leading-relaxed">
                            Simulate your first 1,000 users and attackers before they become real.
                        </p>
                    </div>

                    <div>
                        <h4 class="text-white font-medium mb-6">Product</h4>
                        <ul class="space-y-3 text-gray-400 font-light">
                            <li><a href="/#features" class="hover:text-white transition-colors">Features</a></li>
                            <li><a href="/#pricing" class="hover:text-white transition-colors">Pricing</a></li>
                            <li><a href="/" class="hover:text-white transition-colors">Documentation</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="text-white font-medium mb-6">Company</h4>
                        <ul class="space-y-3 text-gray-400 font-light">
                            <li><a href="/" class="hover:text-white transition-colors">About</a></li>
                            <li><a href="/" class="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="/" class="hover:text-white transition-colors">Careers</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="text-white font-medium mb-6">Support</h4>
                        <ul class="space-y-3 text-gray-400 font-light">
                            <li><a href="/" class="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="/" class="hover:text-white transition-colors">Contact</a></li>
                            <li><a href="/" class="hover:text-white transition-colors">Status</a></li>
                        </ul>
                    </div>
                </div>

                <div class="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 font-light">
                    <p>&copy; 2024 LLM Tester. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>
</div>

<style>
    .font-inter {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
</style>
