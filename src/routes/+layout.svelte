<script lang="ts">
  import './layout.css'
  import favicon from '$lib/assets/favicon.svg'
  import CShellLayout from '$lib/components/CShellLayout.svelte'

  const { children } = $props()
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<CShellLayout>
  {@render children()}
</CShellLayout>
