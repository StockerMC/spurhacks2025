<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import { goto } from "$app/navigation";
    import Logo from "$lib/images/logo.png";
    import Background from "$lib/images/background.jpg";
    import LoadingGif from "$lib//images/loading.gif";

    let email = "";
    let password = "";
    let loading = false;

    function handleLogin() {
        loading = true;
        setTimeout(() => {
            goto("/dashboard");
        }, 2000);
    }
</script>

<!-- svelte-ignore a11y_img_redundant_alt -->
<img
        alt="Background Image"
        class="top-0 left-0 w-full h-full z-[-1] pointer-events-none opacity-75"
        src={Background}
/>

<div class="min-h-screen z-50 absolute top-0 left-0 w-full">
  <header class="flex items-center justify-between px-8 py-6 z-50">
    <div class="flex items-center gap-2">
      <img
              alt="Cat Logo"
              class="w-12 h-auto"
              src={Logo}
      />
      <span class="text-2xl font-bold text-gray-800">Pawditor</span>
    </div>
    <nav class="hidden md:flex text-xl items-center gap-16">
      <a class="text-gray-700 hover:text-gray-900 font-medium transition-colors" href="/">
        Home
      </a>
      <a class="text-gray-700 hover:text-gray-900 font-medium transition-colors" href="/about">
        About
      </a>
      <a class="text-gray-700 hover:text-gray-900 font-medium transition-colors" href="/pricing">
        Contact
      </a>
    </nav>
    <div class="flex items-center text-xl gap-8">
      <button class="text-gray-700 hover:text-gray-900 font-medium transition-colors">
        Log In
      </button>
      <button class="border-2 py-2 border-gray-700 text-gray-700 rounded-full px-6">
        Sign Up
      </button>
    </div>
  </header>
  {#if loading}
    <div class="flex justify-center items-center h-[60vh]">
      <img src={LoadingGif} alt="Loading..." class="w-48 h-48" />
    </div>
  {:else}
    <Card blurBackground={true} class="mx-auto my-12 max-w-md px-6 py-8">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2 text-[#DC5270]">Welcome Back</h1>
        <p class="text-gray-700 font-semibold">Log in to your Pawditor account</p>
      </div>
      <form class="space-y-6" on:submit|preventDefault={handleLogin}>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2" for="email">
            Email Address
          </label>
          <input
                  bind:value={email}
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm resize-none"
                  id="email"
                  placeholder="Enter your email"
                  required
                  type="email"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2" for="password">
            Password
          </label>
          <input
                  bind:value={password}
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm resize-none"
                  id="password"
                  placeholder="Enter your password"
                  required
                  type="password"
          />
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
            />
            <label class="ml-2 block text-sm text-gray-700" for="remember-me">
              Remember me
            </label>
          </div>
          <div class="text-sm">
            <a class="font-medium text-blue-600 hover:text-blue-500" href="#">
              Forgot your password?
            </a>
          </div>
        </div>
        <div class="space-y-4">
          <a
                  class="inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border bg-blue-600 text-white border-blue-700 hover:bg-blue-700 hover:shadow-lg focus:ring-blue-500 px-8 py-4 text-lg rounded-2xl w-full"
                  href="#"
                  on:click|preventDefault={handleLogin}
          >
            <span class="flex items-center gap-2">
              Log In
              <svg class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24">
                <path d="M13 7l5 5m0 0l-5 5m5-5H6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"></path>
              </svg>
            </span>
          </a>
          <div class="text-center">
            <span class="text-sm text-gray-600">
              Don&#39;t have an account?
              <a class="font-medium text-blue-600 hover:text-blue-500" href="#">
                Sign up
              </a>
            </span>
          </div>
        </div>
      </form>
    </Card>
  {/if}
</div>

<style>
    :global(.container) {
        max-width: 1200px;
    }
</style>