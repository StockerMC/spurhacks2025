<script>
  import HomeCard from "$lib/components/HomeCard.svelte";
  import Logo from "$lib/images/logo.png"
  import CatBall from "$lib/images/cat_ball.gif";
  import Background from "$lib/images/background.jpg";
  import CatBox from "$lib/images/cat_box.png";
  import LandingCard from "$lib/components/LandingCard.svelte";
    import { profiles } from "./constants";
</script>

<!-- svelte-ignore a11y_img_redundant_alt -->
<img
        src={Background}
        alt="Background Image"
        class="top-0 left-0 w-full h-full z-[-1] pointer-events-none opacity-75"/>

<div class="min-h-screen z-50 absolute top-0 left-0 w-full">
  <header class="flex items-center justify-between px-8 py-6 z-50">
    <div class="flex items-center gap-2">
      <img
              src={Logo}
              alt="Cat Logo"
              class="w-12 h-auto"
      />
      <span class="text-2xl font-bold text-amber-50">Pawditor</span>
    </div>
    <nav class="hidden md:flex text-xl items-center gap-16">
      <a href="/" class="text-amber-50 hover:text-amber-200 font-medium transition-colors">
        Home
      </a>
      <a href="/" class="text-amber-50 hover:text-amber-200 font-medium transition-colors">
        About
      </a>
      <a href="/" class="text-amber-50 hover:text-amber-200 font-medium transition-colors">
        Contact
      </a>
    </nav>
    <div class="flex items-center text-xl gap-8">
      <a href="/login" class="text-amber-50 hover:text-amber-200 font-medium transition-colors">
        Log In
      </a>
      <a href='/login' class="cursor-pointer border-2 py-2 border-amber-50 text-amber-50 hover:text-amber-200 hover:border-amber-200 rounded-full px-6">
        Sign Up
      </a>
    </div>
  </header>
  <main class="relative overflow-hidden">
    <div class="container mx-auto px-8 py-16">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <h1 class="text-5xl lg:text-6xl font-bold text-zinc-800 leading-tight">
            <span class="text-[#DC5270]">Pounce</span>
            on Bugs Before They
            <span class="text-[#DC5270]">Scratch</span>
            Your Site
          </h1>

          <p class="text-2xl font-medium text-gray-800 max-w-md">
            We simulate your first 1,000 users so you can fix your bugs, UX, and vulnerabilities before they become real
            problems
          </p>

          <a
                  class="text-white rounded-full px-8 py-3 text-lg font-semibold"
                  style="background-color: #DC5270;"
                  href="/login"
          >
            GET STARTED
          </a>
        </div>
        <div class="relative">
          <img
                  src={CatBall}
                  alt="Cat Ball"
                  class="w-full h-auto drop-shadow-2xl bounce"
          />
        </div>
      </div>
    </div>
  </main>
  <div class="relative max-w-6xl pt-36 mx-auto">
    <div class="relative mb-8">
      <div class="bg-gradient-to-br from-cyan-900 via-cyan-700 to-cyan-600 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 border border-slate-600/50">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl -z-10"></div>
        <div class="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-3xl blur-2xl -z-20"></div>

        <div class="text-left">
          <h3 class="text-2xl md:text-4xl font-light text-white mb-6 leading-relaxed">
            need someone to
            <span class="text-[#DC5270] brightness-125 font-medium">find every bug?</span><br>
            <span class="text-[#B2D544] font-medium text-[120%]">test like a beginner?</span><br>
            <span class="text-[#6DBDD5] font-medium text-[140%]">push every limit?</span>
          </h3>
          <p class="text-2xl text-slate-300 font-light">
            our testers have all the <span class="text-white font-medium">(virtual)</span> personalities you need.
            <img
                    src={CatBox}
                    alt="Cat Box"
                    class="inline-block w-20 h-20 ml-4 -scale-x-100 scale-"
            />
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="flex justify-center w-full pt-24">
    <div class="text-center mb-12 max-w-4xl">
      <h2 class="text-4xl md:text-5xl font-bold text-zinc-800 mb-6">
        Meet Your <span class="text-[#DC5270]">Virtual</span> Testing Team
      </h2>
      <p class="text-xl text-gray-600">
        Each AI tester brings a unique perspective to uncover different types of issues
      </p>
    </div>
  </div>

  <div class="flex justify-center w-full pt-12">
    <HomeCard>
      <div class="grid grid-cols-2 md:grid-cols-2 gap-4">
        {#each profiles as profile}
          <LandingCard
                  icon={profile.icon}
                  name={profile.name}
                  description={profile.description}
                  question={profile.question}
          />
        {/each}
      </div>
    </HomeCard>
  </div>
</div>

<!-- Footer -->
<footer class="bg-white border-t border-gray-200 mt-auto">
  <div class="max-w-7xl mx-auto px-6 py-8">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <!-- Company Info -->
      <div class="col-span-1 md:col-span-2">
        <div class="flex items-center space-x-3 mb-4">
          <img
                  src={Logo}
                  alt="Cat Logo"
                  class="w-12 h-auto"/>
          <span class="text-xl font-semibold text-gray-900">Pawditor</span>
        </div>
        <p class="text-gray-600 mb-4 max-w-md">
          AI-powered website testing platform that helps you identify issues, improve user experience, and ensure your applications work flawlessly across all scenarios.
        </p>
        <div class="flex space-x-4">
          <a href="#" class="text-gray-400 hover:text-gray-600 transition-colors">
            <span class="sr-only">Twitter</span>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
            </svg>
          </a>
          <a href="https://github.com/StockerMC/spurhacks2025/" class="text-gray-400 hover:text-gray-600 transition-colors">
            <span class="sr-only">GitHub</span>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
          </a>
          <a href="#" class="text-gray-400 hover:text-gray-600 transition-colors">
            <span class="sr-only">LinkedIn</span>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        </div>
      </div>

      <!-- Product Links -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Product</h3>
        <ul class="space-y-3">
          <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Features</a></li>
          <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a></li>
          <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">API</a></li>
          <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Documentation</a></li>
          <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Integrations</a></li>
        </ul>
      </div>

      <!-- Support Links -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Support</h3>
        <ul class="space-y-3">
          <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Help Center</a></li>
          <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Contact Us</a></li>
          <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Status</a></li>
          <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Community</a></li>
          <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Security</a></li>
        </ul>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="mt-8 pt-8 border-t border-gray-200">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="flex space-x-6 mb-4 md:mb-0">
          <a href="#" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</a>
          <a href="#" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</a>
          <a href="#" class="text-sm text-gray-600 hover:text-gray-900 transition-colors">Cookie Policy</a>
        </div>
        <p class="text-sm text-gray-600">
          © 2025 Pawditor. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</footer>


<style>
    :global(.container) {
        max-width: 1200px;
    }

    :global(.animate-float) {
        animation: float 6s ease-in-out infinite;
    }

    :global(.animate-float-delayed) {
        animation: float 6s ease-in-out infinite;
        animation-delay: 3s;
    }

    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-20px);
        }
    }

    :global(.space-y-6 > * + *) {
        margin-top: 1.5rem;
    }

    .bounce {
        animation: bounce 10s infinite ease-in-out;
    }

    @keyframes bounce {
        0%, 100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-20px);
        }
    }
</style>
