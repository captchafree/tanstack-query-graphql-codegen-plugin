import { getUserById } from "../generated/functions"

export async function load({ parent, fetch }) {
    const { queryClient } = await parent()
  
    await queryClient.prefetchQuery({
      ...getUserById({ id: '1' }, fetch)
    })
  }
  