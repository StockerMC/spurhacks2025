<script>
  import HomeCard from "$lib/components/HomeCard.svelte";
  import Logo from "$lib/images/logo.png"
  import CatBall from "$lib/images/cat_ball.gif";
  import Background from "$lib/images/background.jpg";
  import CatBox from "$lib/images/cat_box.png";
  import CharacterCard from "$lib/components/CharacterCard.svelte";
  import Hacker from "$lib/images/hacker.png";
  import GrandpaJoe from "$lib/images/grandpa_joe.png";
  import PowerUser from "$lib/images/power_user.png";
  import MobileSarah from "$lib/images/mobile_sarah.png";
  import SkepticalSam from "$lib/images/skeptical.gif";
  import AccessibilityAnna from "$lib/images/disabled.png";
  import LandingCard from "$lib/components/LandingCard.svelte";

  const profiles = [
    {
      name: "The Hacker",
      description: "finds every vulnerability",
      icon: Hacker,
      color: "from-red-400 to-red-600",
      question: "what if I try to break this?"
    },
    {
      name: "Grandpa Joe",
      description: "represents confused users",
      icon: GrandpaJoe,
      color: "from-blue-400 to-blue-600",
      question: "how do I even use this?"
    },
    {
      name: "Power User",
      description: "pushes every limit",
      icon: PowerUser,
      color: "from-purple-400 to-purple-600",
      question: "can this handle my workflow?"
    },
    {
      name: "Mobile Sarah",
      description: "tests on tiny screens",
      icon: MobileSarah,
      color: "from-green-400 to-green-600",
      question: "does this work on mobile?"
    },
    {
      name: "Skeptical Sam",
      description: "questions everything",
      icon: SkepticalSam,
      color: "from-yellow-400 to-yellow-600",
      question: "is this actually useful?"
    },
    {
      name: "Accessibility Anna",
      description: "needs inclusive design",
      icon: AccessibilityAnna,
      color: "from-pink-400 to-pink-600",
      question: "can everyone use this?"
    }
  ];
</script>

<!-- svelte-ignore a11y_img_redundant_alt -->
<img
        src={Background}
        alt="Background Image"
        class="top-0 left-0 w-full h-full z-[-1] pointer-events-none opacity-75"/>

<div class="min-h-screen z-50 absolute top-0 left-0 w-full">
  <header class="flex items-center justify-between px-8 py-6 z-50]">
    <div class="flex items-center gap-2">
      <img
              src={Logo}
              alt="Cat Logo"
              class="w-12 h-auto"/>
      <span class="text-2xl font-bold text-gray-800">Pawditor</span>
    </div>
    <nav class="hidden md:flex text-xl items-center gap-16">
      <a href="/" class="text-gray-700 hover:text-gray-900 font-medium transition-colors">
        Home
      </a>
      <a href="/about" class="text-gray-700 hover:text-gray-900 font-medium transition-colors">
        About
      </a>
      <a href="/pricing" class="text-gray-700 hover:text-gray-900 font-medium transition-colors">
        Pricing
      </a>
    </nav>
    <div class="flex items-center text-xl gap-8">
      <a href="/login" class="text-gray-700 hover:text-gray-900 font-medium transition-colors">
        Log In
      </a>
      <button class="border-2 py-2 border-gray-700 text-gray-700 rounded-full px-6">
        Sign Up
      </button>
    </div>
  </header>
  <main class="relative overflow-hidden">
    <div class="container mx-auto px-8 py-16">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <h1 class="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
            <span class="text-[#DC5270]">Pounce</span>
            on Bugs Before They
            <span class="text-[#DC5270]">Scratch</span>
            Your Site
          </h1>

          <p class="text-2xl font-medium text-gray-600 max-w-md">
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
            <span class="text-[#B2D544] font-medium">test like a beginner?</span><br>
            <span class="text-[#6DBDD5] font-medium">push every limit?</span>
          </h3>
          <p class="text-xl text-slate-300 font-light">
            our testers have all the <span class="text-white font-medium">(virtual)</span> personalities you need.
            <img
                    src={CatBox}
                    alt="Cat Box"
                    class="inline-block w-10 h-10 ml-4 -scale-x-100"
            />
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="flex justify-center w-full pt-12">
    <HomeCard>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
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
