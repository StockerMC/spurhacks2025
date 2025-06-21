<script lang="ts">
    import Card from '$lib/components/Card.svelte';
    import Button from '$lib/components/Button.svelte';
    import { goto } from '$app/navigation';

    let email = '';
    let password = '';

    function handleLogin() {
        goto('/dashboard');
    }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-900 via-cyan-700 to-cyan-600">
    <div class="max-w-md mx-auto relative z-10 w-full px-4">
        <Card>
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                <p class="text-gray-600">Sign in to your LLM Tester account</p>
            </div>
            <form class="space-y-6" on:submit|preventDefault={handleLogin}>
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <input
                            type="email"
                            id="email"
                            bind:value={email}
                            required
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm resize-none"
                            placeholder="Enter your email"
                    />
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <input
                            type="password"
                            id="password"
                            bind:value={password}
                            required
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm resize-none"
                            placeholder="Enter your password"
                    />
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                            Remember me
                        </label>
                    </div>
                    <div class="text-sm">
                        <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
                            Forgot your password?
                        </a>
                    </div>
                </div>
                <div class="space-y-4">
                    <Button
                            variant="primary"
                            size="lg"
                            on:click={handleLogin}
                            class="w-full"
                    >
                        Sign In
                    </Button>
                    <div class="text-center">
                        <span class="text-sm text-gray-600">
                            Don&#39;t have an account?
                            <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
                                Sign up
                            </a>
                        </span>
                    </div>
                </div>
            </form>
        </Card>
    </div>
</div>

<script>
    import Logo from "$lib/images/logo.png";
    import Background from "$lib/images/background.jpg";
</script>

<!-- svelte-ignore a11y_img_redundant_alt -->
<img
        src={Background}
        alt="Background Image"
        class="top-0 left-0 w-full h-full z-[-1] pointer-events-none opacity-75"
/>

<div class="min-h-screen z-50 absolute top-0 left-0 w-full">
    <header class="flex items-center justify-between px-8 py-6 z-50">
        <div class="flex items-center gap-2">
            <img
                    src={Logo}
                    alt="Cat Logo"
                    class="w-12 h-auto"
            />
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
            <button class="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                Sign In
            </button>
            <button class="border-2 py-2 border-gray-700 text-gray-700 rounded-full px-6">
                Sign Up
            </button>
        </div>
    </header>
    <!-- Add your content here later -->
</div>

<style>
    :global(.container) {
        max-width: 1200px;
    }
</style>
