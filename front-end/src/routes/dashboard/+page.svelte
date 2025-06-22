<script lang="ts">
    import { onMount } from "svelte";
    import CatBox from "$lib/images/cat_box.png";
    import Button from "$lib/components/Button.svelte";
    import { createClient } from "@supabase/supabase-js";
    import Pfp from "$lib/images/pfp.png";
    import CatLying from "$lib/images/cat_lying.png";
    import Train from "$lib/images/train.png";
    import { goto } from "$app/navigation";

    let mounted = $state(false);
    // TODO: ADD RATING SYSTEM RATHER THAN PROGRESS BAR + COLORS`
    // TODO: USE CARD COMPONENT INSTEAD LOLOL

    onMount(() => {
        mounted = true;
        let res = supabase
            .from("projects")
            .select("*");
        res.then(data => {
            projectsList = data.data.reverse();
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
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</svelte:head>

<div class="fixed inset-0 overflow-hidden pointer-events-none">
  <div class="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-300/40 to-purple-300/30 rounded-full blur-3xl"></div>
  <div class="absolute top-40 right-20 w-80 h-80 bg-gradient-to-br from-pink-300/35 to-blue-300/25 rounded-full blur-3xl"></div>
  <div class="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-purple-300/30 to-pink-300/35 rounded-full blur-3xl"></div>
</div>
<img
  src={Train}
  alt="Train"
  class="absolute bottom-10 right-10 h-[30%]"/>

<div class="absolute top-0 left-0 w-full min-h-screen font-inter">
  <!-- Header -->
  <header class="border-b border-gray-200 sticky top-0 z-50">
    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 border rounded-xl flex items-center justify-center">
            <img src={CatBox} alt="Cat Box Logo" class="w-8 h-8"/>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Pawditor Dashboard</h1>
            <p class="text-sm text-gray-700">Manage your pawditor projects</p>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-3">
            <button class="bg-[#6DBDD5] text-gray-50 rounded-full px-4 py-2">
              Analytics
            </button>
            <button class="bg-[#6DBDD5] text-gray-50 rounded-full px-4 py-2">
              Settings
            </button>
            <div class="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
              <!-- svelte-ignore a11y_img_redundant_alt -->
              <img src={Pfp} alt="Profile Picture" class="w-10 h-10 rounded-full"/>
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
            <p class="text-gray-600">Monitor and manage your pawditor projects</p>
          </div>
          <div class="flex items-center space-x-3">
            <button class="bg-[#6DBDD5] text-gray-50 rounded-full px-4 py-2">
              Search
            </button>
            <button class="bg-[#6DBDD5] text-gray-50 rounded-full px-4 py-2">
              Filter
            </button>
          </div>
        </div>
      </div>

      <!-- Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- New Project Card -->
        <button
                class="group relative bg-white rounded-2xl border-2 border-dashed border-gray-300 hover:border-[#6DBDD5] transition-all duration-300 p-8 flex flex-col items-center justify-center min-h-[320px] hover:shadow-lg"
                onclick={createNewProject}
        >
          <img src={CatLying} alt="New Project Icon" class="group-hover:scale-110 transition-transform z-10 -mb-4 h-10"/>
          <div class="w-16 h-16 bg-[#6DBDD5] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <span class="text-white text-2xl font-bold">+</span>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">New Project</h3>
          <p class="text-gray-500 text-center">Start testing a new application with our AI-powered testers</p>
          <div class="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span class="text-[#6DBDD5] font-medium">Click to create →</span>
          </div>
        </button>
        {#each projectsList as project}
          <div class="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">
            <div class="bg-gradient-to-r from-[#4cafcd] to-[#9cd2e3] p-6 text-white relative">
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <h3 class="text-xl font-semibold mb-2 line-clamp-1">{project.name}</h3>
                </div>
                <span class="px-2 py-1 bg-black/10 rounded-lg text-xs font-medium capitalize backdrop-blur-sm">
                  Active
                </span>
              </div>
              <div class="mb-2">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-white/90">Progress</span>
                  <span class="font-medium">{Math.floor(Math.min(100, (Date.now() - new Date(project.created_at).getTime()) / 1000))}%</span>
                </div>
                <div class="w-full bg-white/20 rounded-full h-2">
                  <div class="bg-white rounded-full h-2 transition-all duration-500"
                       style="width: {Math.min(100, (Date.now() - new Date(project.created_at).getTime()) / 1000)}%"></div>
                </div>
              </div>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-2 gap-4 mb-6">
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900">3</div>
                  <div class="text-xs text-gray-500">Active Testers</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900">4</div>
                  <div class="text-xs text-gray-500">Total Tests</div>
                </div>
              </div>
              <div class="space-y-3 mb-6">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Issues Found</span>
                  <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-200 text-yellow-900">
                    pending
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Last Activity</span>
                  <span class="text-sm font-medium text-gray-900">This Hour</span>
                </div>
              </div>
              <div class="flex items-center justify-between space-x-2">
                <a class="text-gray-700" href="/dashboard/project/{project.id}">
                  View Details
                </a>
                <Button variant="outline" size="sm">
                  <span class="text-lg">⚙️</span>
                </Button>
              </div>
            </div>
          </div>
        {/each}
        <!--{#each projects as project}-->
        <!--  <div class="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200">-->
        <!--    &lt;!&ndash; Project Header &ndash;&gt;-->
        <!--    <div class="bg-gradient-to-r {project.color} p-6 text-white relative">-->
        <!--      <div class="flex items-start justify-between mb-4">-->
        <!--        <div class="flex-1">-->
        <!--          <h3 class="text-xl font-semibold mb-2 line-clamp-1">{project.name}</h3>-->
        <!--          <p class="text-white/90 text-sm line-clamp-2">{project.description}</p>-->
        <!--        </div>-->
        <!--        <span class="px-2 py-1 bg-white/20 rounded-lg text-xs font-medium capitalize backdrop-blur-sm">-->
        <!--          {project.status}-->
        <!--        </span>-->
        <!--      </div>-->

        <!--      &lt;!&ndash; Progress Bar &ndash;&gt;-->
        <!--      <div class="mb-2">-->
        <!--        <div class="flex justify-between text-sm mb-1">-->
        <!--          <span class="text-white/90">Progress</span>-->
        <!--          <span class="font-medium">{project.progress}%</span>-->
        <!--        </div>-->
        <!--        <div class="w-full bg-white/20 rounded-full h-2">-->
        <!--          <div class="bg-white rounded-full h-2 transition-all duration-500"-->
        <!--               style="width: {project.progress}%"></div>-->
        <!--        </div>-->
        <!--      </div>-->
        <!--    </div>-->

        <!--    &lt;!&ndash; Project Stats &ndash;&gt;-->
        <!--    <div class="p-6">-->
        <!--      <div class="grid grid-cols-2 gap-4 mb-6">-->
        <!--        <div class="text-center">-->
        <!--          <div class="text-2xl font-bold text-gray-900">{project.testersActive}</div>-->
        <!--          <div class="text-xs text-gray-500">Active Testers</div>-->
        <!--        </div>-->
        <!--        <div class="text-center">-->
        <!--          <div class="text-2xl font-bold text-gray-900">{project.totalTests.toLocaleString()}</div>-->
        <!--          <div class="text-xs text-gray-500">Total Tests</div>-->
        <!--        </div>-->
        <!--      </div>-->

        <!--      &lt;!&ndash; Issues & Last Activity &ndash;&gt;-->
        <!--      <div class="space-y-3 mb-6">-->
        <!--        <div class="flex items-center justify-between">-->
        <!--          <span class="text-sm text-gray-600">Issues Found</span>-->
        <!--          <span class="px-2 py-1 rounded-full text-xs font-medium {project.issues > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">-->
        <!--            {project.issues} {project.issues === 1 ? 'issue' : 'issues'}-->
        <!--          </span>-->
        <!--        </div>-->
        <!--        <div class="flex items-center justify-between">-->
        <!--          <span class="text-sm text-gray-600">Last Activity</span>-->
        <!--          <span class="text-sm font-medium text-gray-900">{project.lastActivity}</span>-->
        <!--        </div>-->
        <!--      </div>-->

        <!--      &lt;!&ndash; Action Buttons &ndash;&gt;-->
        <!--      <div class="flex space-x-2">-->
        <!--        <Button variant="primary" size="sm" class="flex-1">-->
        <!--          View Details-->
        <!--        </Button>-->
        <!--        <Button variant="outline" size="sm">-->
        <!--          <span class="text-lg">⚙️</span>-->
        <!--        </Button>-->
        <!--      </div>-->
        <!--    </div>-->
        <!--  </div>-->
        <!--{/each}-->
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
