<script lang="ts">
  // FIXME: SUPPORT GIFS/IMAGES SINCE MERGE CONFLICT OVERWROTE AARON'S CHANGES
  interface Props {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark' | 'text';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    icon?: boolean;
    href?: string;
    onclick?: () => void;
    children: any;
  }

  let {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon = false,
    href,
    onclick,
    children,
    ...rest
  }: Props = $props();

  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border';

  const variants = {
    primary: 'bg-blue-600 text-white border border-blue-700 hover:bg-blue-700 hover:shadow-lg focus:ring-blue-500',
    secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 hover:shadow-md focus:ring-gray-500',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 focus:ring-gray-500',
    dark: 'bg-gray-900 text-white border border-gray-700 hover:bg-gray-800 hover:shadow-lg focus:ring-gray-600',
    text: 'bg-transparent text-gray-600 border border-transparent hover:text-gray-900 hover:bg-gray-50 focus:ring-gray-500'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-2xl',
    md: 'px-6 py-3 text-base rounded-2xl',
    lg: 'px-8 py-4 text-lg rounded-2xl'
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]}`;
</script>

{#if href}
  <a {href} class={buttonClasses} {...rest}>
    <span class="flex items-center gap-2">
      {#if loading}
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      {/if}
      {@render children()}
      {#if icon && !loading}
        <svg class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
        </svg>
      {/if}
    </span>
  </a>
{:else}
  <button
          class="{buttonClasses} group"
          {disabled}
          onclick={onclick}
          {...rest}
  >
    <span class="flex items-center gap-2">
      {#if loading}
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      {/if}
      {@render children()}
      {#if icon && !loading}
        <svg class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
        </svg>
      {/if}
    </span>
  </button>
{/if}
