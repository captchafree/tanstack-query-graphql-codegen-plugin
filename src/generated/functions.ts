import * as types from './graphql';

export type QueryResult<T> = {
  queryKey: unknown[],
  queryFn: () => Promise<T>
};


export const getUserById = (params: types.GetUserByIdQueryVariables, f = fetch): QueryResult<types.GetUserByIdQuery> => ({
  queryKey: ["GetUserById", params.id],
  queryFn: async () => {
    const res = await f('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetUserById($id: ID!) {
  user(id: $id) {
    id
    name
  }
}
        `,
        variables: params
      }),
    });

    if (!res.ok) {
      throw new Error('There was an error');
    }

    const data = await res.json();
    return data;
  },
});

export const getUserByIdV2 = (params: types.GetUserByIdV2QueryVariables, f = fetch): QueryResult<types.GetUserByIdV2Query> => ({
  queryKey: ["GetUserByIdV2", params.id, params.id2],
  queryFn: async () => {
    const res = await f('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
          query GetUserByIdV2($id: ID!, $id2: ID!) {
  user(id: $id) {
    name
  }
}
        `,
        variables: params
      }),
    });

    if (!res.ok) {
      throw new Error('There was an error');
    }

    const data = await res.json();
    return data;
  },
});
