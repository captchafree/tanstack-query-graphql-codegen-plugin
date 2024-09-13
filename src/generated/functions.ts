import * as types from './graphql';

export type TanstackQueryParams<T> = {
  queryKey: unknown[],
  queryFn: () => Promise<T>
};

type QueryArgs = {
    query: string,
    variables: any
  }

async function executeQuery(f = fetch, args: QueryArgs) {
  const res = await f('/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: args.query,
      variables: args.variables,
    }),
  });

  if (!res.ok) {
    throw new Error('There was an error');
  }

  return await res.json()
}



export const getUserById = (params: types.GetUserByIdQueryVariables, f = fetch): TanstackQueryParams<types.GetUserByIdQuery> => ({
  queryKey: ["GetUserById", params.id],
  queryFn: async () => executeQuery(f, {
     query: `
          query GetUserById($id: ID!) {
  user(id: $id) {
    id
    name
  }
}
        `,
        variables: params
      })
});

export const getUserByIdV2 = (params: types.GetUserByIdV2QueryVariables, f = fetch): TanstackQueryParams<types.GetUserByIdV2Query> => ({
  queryKey: ["GetUserByIdV2", params.id, params.id2],
  queryFn: async () => executeQuery(f, {
     query: `
          query GetUserByIdV2($id: ID!, $id2: ID!) {
  user(id: $id) {
    name
  }
}
        `,
        variables: params
      })
});
