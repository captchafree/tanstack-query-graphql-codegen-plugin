<script lang="ts">
  import { getUserById } from "../generated/functions";
  import { createQuery } from '@tanstack/svelte-query'
  import type { PageData } from './$types'

  export let data: PageData;
  
  const query = createQuery({
    ...getUserById({ id: '1' }),
  })
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
