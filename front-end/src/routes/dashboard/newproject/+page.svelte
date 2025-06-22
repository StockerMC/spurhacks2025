<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import Button from "$lib/components/Button.svelte";
    import CatBox from "$lib/images/cat_box.png";
    import CatAnimation from "$lib/components/CatAnimation.svelte";
    import { createClient } from "@supabase/supabase-js";
    import { goto } from "$app/navigation";

    let currentStep = $state(1);
    let totalSteps = 6;

    // Step messages - cat-themed for speech bubbles only
    const STEP_DATA = {
        1: {
            messages: [
                "Let's start with the basics *meow*",
                "Give your project a name and tell us what you want to test!",
                "I'm here to help you set up your testing project! Let's make this purrfect together 🐾"
            ]
        },
        2: {
            messages: [
                "What type of testing do you need? *purr*",
                "Choose the focus area that best matches your goals!",
                "Let's find the perfect testing approach for you! This is going to be pawsome! 🐾"
            ]
        },
        3: {
            messages: [
                "Which pages should we test? *excited meow*",
                "Pick the pages you want our agents to pounce on!",
                "Great! Now let's pick which pages to test! I'm feline good about this! 🐾"
            ]
        },
        4: {
            messages: [
                "What specifically should we test? *curious meow*",
                "Choose the areas where our agents will hunt for bugs!",
                "Perfect! Let's get specific about what to test! Time to catch all the bugs! 🐾"
            ]
        },
        5: {
            messages: [
                "Choose your testing agents *happy purr*",
                "Pick the AI personas that will prowl through your website!",
                "Awesome! Time to choose your testing dream team! Let's make this purrfect together! 🐾"
            ]
        },
        6: {
            messages: [
                "Ready to launch your tests? *excited meow*",
                "Review your settings and add any final whiskers... I mean notes!",
                "Amazing! You're all set to launch your tests! This is going to be cat-astrophically good! 🐾"
            ]
        }
    };

    // Form data
    let projectName = $state("");
    let websiteUrl = $state("");
    let testingType = $state("");
    let selectedPages = $state<string[]>([]);
    let customPages = $state("");
    let specificTests = $state<string[]>([]);
    let customTests = $state("");
    let selectedAgents = $state<string[]>([]);
    let agentCounts = $state<Record<string, number>>({});
    let additionalNotes = $state("");

    const testingTypes = [
        {
            name: "Full Website Audit",
            description: "Comprehensive testing of entire website",
            icon: "🌍",
            iconClass: "text-blue-500"
        },
        {
            name: "Security Focus",
            description: "Deep security and vulnerability testing",
            icon: "🔒",
            iconClass: "text-red-500"
        },
        {
            name: "UX & Usability",
            description: "User experience and accessibility testing",
            icon: "👤",
            iconClass: "text-purple-500"
        },
        {
            name: "Performance Testing",
            description: "Speed, load times, and optimization",
            icon: "⚡",
            iconClass: "text-yellow-500"
        }
    ];

    const commonPages = [
        "Homepage",
        "Login/Signup",
        "Product Pages",
        "Checkout/Payment",
        "User Dashboard",
        "Contact/Support",
        "About Us",
        "Search Results",
        "Blog/News"
    ];

    const testCategories = [
        "Cross-browser compatibility",
        "Mobile responsiveness",
        "Form validation",
        "Payment processing",
        "User authentication",
        "Search functionality",
        "Navigation flow",
        "Error handling",
        "Data security",
        "Performance optimization"
    ];

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

    const nextStep = () => {
        if (currentStep < totalSteps) currentStep++;
    };
    const prevStep = () => {
        if (currentStep > 1) currentStep--;
    };
    const toggleSelection = (array: string[], item: string) => {
        const index = array.indexOf(item);
        index > -1 ? array.splice(index, 1) : array.push(item);
    };

    const toggleAgent = (agentName: string) => {
        const index = selectedAgents.indexOf(agentName);
        if (index > -1) {
            selectedAgents.splice(index, 1);
            delete agentCounts[agentName];
        } else {
            selectedAgents.push(agentName);
            agentCounts[agentName] = 1;
        }
    };

    const updateAgentCount = (agentName: string, count: number) => {
        if (count >= 1 && count <= 50) {
            agentCounts[agentName] = count;
        }
    };

    const supabase = createClient(
        "https://ttnxgveqyvtsjlwvpecl.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0bnhndmVxeXZ0c2psd3ZwZWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NDUwNzgsImV4cCI6MjA2NjEyMTA3OH0.EkiiotOoeCCpt5kY2_oSVVTCm_7M9IXoNWUt5O8WiwQ"
    );

    const createProject = async () => {
        console.log("Creating project with:", {
            projectName,
            websiteUrl,
            testingType,
            selectedPages,
            customPages,
            specificTests,
            customTests,
            selectedAgents,
            agentCounts,
            additionalNotes
        });


        const { data, error } = await supabase
            .from("projects")
            .insert([
                {
                    "name": projectName,
                    "url": websiteUrl,
                },
            ])
            .select();

        const rowId = data?.[0]?.id;
        await goto(`/dashboard/project`)
    };
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 font-inter">
  <!-- Background Effects -->
  <div class="fixed inset-0 overflow-hidden pointer-events-none">
    <div class="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-300/40 to-purple-300/30 rounded-full blur-3xl"></div>
    <div class="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-pink-300/35 to-blue-300/25 rounded-full blur-3xl"></div>
    <div class="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-300/30 to-pink-300/35 rounded-full blur-3xl"></div>
  </div>

  <!-- Header -->
  <header class="relative z-10 px-6 py-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-12 h-12 border rounded-xl flex items-center justify-center">
          <img src={CatBox || "/placeholder.svg"} alt="Cat Box Logo" class="w-8 h-8"/>
        </div>
        <div>
          <h1 class="text-xl font-bold text-gray-900">New Project</h1>
          <p class="text-sm text-gray-600">Step {currentStep} of {totalSteps}</p>
        </div>
      </div>
      <Button variant="outline" href="/dashboard">← Back to Dashboard</Button>
    </div>

    <!-- Progress Bar -->
    <div class="max-w-7xl mx-auto mt-6">
      <div class="w-full bg-white/30 rounded-full h-2">
        <div class="bg-gradient-to-r from-[#6DBDD5] to-purple-400 h-2 rounded-full transition-all duration-500"
             style="width: {(currentStep / totalSteps) * 100}%"></div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="relative z-10 px-6 py-8">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

        <!-- Cat Animation Section -->
        <div class="lg:col-span-2">
          <CatAnimation
                  step={currentStep}
                  messages={STEP_DATA[currentStep].messages}
          />
        </div>

        <!-- Form Section - No fade animations -->
        <div class="lg:col-span-3">

          <!-- Step 1: Project Basics -->
          {#if currentStep === 1}
            <Card>
              <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Let's start with the basics</h2>
                <p class="text-gray-600">Give your project a name and tell us what you want to test</p>
              </div>
              <div class="space-y-6">
                <div>
                  <label for="project-name" class="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
                  <input type="text" id="project-name" bind:value={projectName}
                         placeholder="e.g., My E-commerce Website Testing"
                         class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"/>
                </div>
                <div>
                  <label for="website-url" class="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                  <input type="url" id="website-url" bind:value={websiteUrl} placeholder="https://your-website.com"
                         class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"/>
                </div>
              </div>
              <div class="flex justify-end mt-8">
                <Button variant="primary" onclick={nextStep} disabled={!projectName || !websiteUrl}>Continue →</Button>
              </div>
            </Card>
          {/if}

          <!-- Step 2: Testing Type -->
          {#if currentStep === 2}
            <Card>
              <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">What type of testing do you need?</h2>
                <p class="text-gray-600">Choose the focus area that best matches your goals</p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each testingTypes as type}
                  <button
                          class="p-6 rounded-xl border-2 transition-all text-left hover:shadow-lg hover:border-blue-500 hover:bg-blue-50 {testingType === type.name ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 bg-white/80'}"
                          onclick={() => testingType = type.name}
                  >
                    <div class="flex items-start space-x-4">
                      <div class="text-3xl {type.iconClass}">
                        {type.icon}
                      </div>
                      <div class="flex-1">
                        <h3 class="font-semibold text-gray-900 mb-1">{type.name}</h3>
                        <p class="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </div>
                  </button>
                {/each}
              </div>
              <div class="flex justify-between mt-8">
                <Button variant="outline" onclick={prevStep}>← Back</Button>
                <Button variant="primary" onclick={nextStep} disabled={!testingType}>Continue →</Button>
              </div>
            </Card>
          {/if}

          <!-- Step 3: Pages to Test -->
          {#if currentStep === 3}
            <Card>
              <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Which pages should we test?</h2>
                <p class="text-gray-600">Select the pages you want our agents to focus on</p>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {#each commonPages as page}
                  <button class="p-3 rounded-xl border-2 transition-all hover:border-blue-500 hover:shadow-md hover:bg-blue-50 {selectedPages.includes(page) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white/60'}"
                          onclick={() => toggleSelection(selectedPages, page)}>
                    <span class="text-sm font-medium">{page}</span>
                  </button>
                {/each}
              </div>
              <div>
                <label for="custom-pages" class="block text-sm font-medium text-gray-700 mb-2">Additional Pages
                  (optional)</label>
                <textarea bind:value={customPages} id="custom-pages"
                          placeholder="List any specific pages or URLs you want tested..."
                          class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 h-24"></textarea>
              </div>
              <div class="flex justify-between mt-8">
                <Button variant="outline" onclick={prevStep}>← Back</Button>
                <Button variant="primary" onclick={nextStep} disabled={selectedPages.length === 0}>Continue →</Button>
              </div>
            </Card>
          {/if}

          <!-- Step 4: Specific Tests -->
          {#if currentStep === 4}
            <Card>
              <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">What specifically should we test?</h2>
                <p class="text-gray-600">Choose the areas you want our agents to focus on</p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {#each testCategories as test}
                  <button class="p-4 rounded-xl border-2 transition-all text-left hover:border-blue-500 hover:shadow-md hover:bg-blue-50 {specificTests.includes(test) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white/60'}"
                          onclick={() => toggleSelection(specificTests, test)}>
                    <span class="text-sm font-medium">{test}</span>
                  </button>
                {/each}
              </div>
              <div>
                <label for="custom-tests" class="block text-sm font-medium text-gray-700 mb-2">Custom Testing
                  Requirements</label>
                <textarea bind:value={customTests} id="custom-tests"
                          placeholder="Describe any specific functionality, edge cases, or scenarios you want tested..."
                          class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 h-32"></textarea>
              </div>
              <div class="flex justify-between mt-8">
                <Button variant="outline" onclick={prevStep}>← Back</Button>
                <Button variant="primary" onclick={nextStep} disabled={specificTests.length === 0}>Continue →</Button>
              </div>
            </Card>
          {/if}

          <!-- Step 5: Agent Selection -->
          {#if currentStep === 5}
            <Card>
              <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Choose your testing agents</h2>
                <p class="text-gray-600">Select the AI personas that will test your website</p>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each profiles as profile}
                  <div class="relative">
                    <button
                            class="w-full p-6 rounded-xl border-2 transition-all text-left hover:shadow-lg hover:border-blue-500 hover:bg-blue-50 {selectedAgents.includes(profile.name) ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-gray-200 bg-white/80'}"
                            onclick={() => toggleAgent(profile.name)}
                    >
                      <div class="flex items-start space-x-4">
                        <div class="text-3xl">
                          {profile.icon}
                        </div>
                        <div class="flex-1">
                          <h3 class="font-semibold text-gray-900 mb-1">{profile.name}</h3>
                          <p class="text-sm text-gray-600 mb-2">{profile.description}</p>
                          <p class="text-xs text-gray-500 italic">"{profile.question}"</p>
                        </div>
                      </div>
                    </button>
                    {#if selectedAgents.includes(profile.name)}
                      <div class="absolute top-2 left-2">
                        <select
                                bind:value={agentCounts[profile.name]}
                                class="w-12 h-8 bg-blue-500 text-white text-sm font-medium rounded text-center appearance-none cursor-pointer outline-none"
                        >
                          {#each Array.from({length: 50}, (_, i) => i + 1) as num}
                            <option value={num}>{num}</option>
                          {/each}
                        </select>
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
              <div class="mt-6 p-4 bg-blue-50 rounded-xl">
                <p class="text-sm text-blue-800">
                  <strong>Tip:</strong> We recommend selecting at least 3-4 different agent types for comprehensive
                  testing coverage.
                  Total agents: <strong>{Object.values(agentCounts).reduce((sum, count) => sum + count, 0)}</strong>
                </p>
              </div>
              <div class="flex justify-between mt-8">
                <Button variant="outline" onclick={prevStep}>← Back</Button>
                <Button variant="primary" onclick={nextStep} disabled={selectedAgents.length === 0}>Continue →</Button>
              </div>
            </Card>
          {/if}

          <!-- Step 6: Final Review -->
          {#if currentStep === 6}
            <Card>
              <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-4">Ready to launch your tests?</h2>
                <p class="text-gray-600">Review your settings and add any final notes</p>
              </div>
              <div class="space-y-6">
                <div class="bg-white/60 rounded-xl p-6">
                  <h3 class="font-semibold text-gray-900 mb-4">Project Summary</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><span class="text-gray-600">Project Name:</span><span
                            class="font-medium ml-2">{projectName}</span></div>
                    <div><span class="text-gray-600">Website:</span><span class="font-medium ml-2">{websiteUrl}</span>
                    </div>
                    <div><span class="text-gray-600">Testing Type:</span><span
                            class="font-medium ml-2">{testingType}</span></div>
                    <div><span class="text-gray-600">Total Agents:</span><span
                            class="font-medium ml-2">{Object.values(agentCounts).reduce((sum, count) => sum + count, 0)}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label for="additional-notes" class="block text-sm font-medium text-gray-700 mb-2">Additional Notes
                    (optional)</label>
                  <textarea bind:value={additionalNotes} id="additional-notes"
                            placeholder="Any additional context, requirements, or special instructions for the testing agents..."
                            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 h-24"></textarea>
                </div>
                <div class="bg-green-50 rounded-xl p-6">
                  <h4 class="font-semibold text-green-900 mb-2">Estimated Timeline</h4>
                  <p class="text-green-800 text-sm">Based on your selections, testing should complete in approximately
                    <strong>1-2 minutes</strong>. You'll receive real-time updates as our agents work through your
                    website.</p>
                </div>
              </div>
              <div class="flex justify-between mt-8">
                <Button variant="outline" onclick={prevStep}>← Back</Button>
                <Button variant="primary" onclick={createProject} size="lg">Launch Project</Button>
              </div>
            </Card>
          {/if}
        </div>
      </div>
    </div>
  </main>
</div>

<style>
    .font-inter {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    textarea {
        resize: none;
    }
</style>
