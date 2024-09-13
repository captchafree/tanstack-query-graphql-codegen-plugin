const { PluginFunction } = require('@graphql-codegen/plugin-helpers');

const returnTypeName = "TanstackQueryParams"

/**
 * GraphQL Codegen Plugin to generate TanStack Query functions
 * @type {PluginFunction}
 */
const plugin = (schema, documents, config) => {
  let generatedCode = `import * as types from './graphql';\n\n`;

  generatedCode += `export type ${returnTypeName}<T> = {
  queryKey: unknown[],
  queryFn: () => Promise<T>
};\n\n`

generatedCode += `type QueryArgs = {
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
}\n\n
`

  documents.forEach((doc) => {
    doc.document.definitions.forEach((definition) => {
      if (definition.kind === 'OperationDefinition' && definition.operation === 'query') {
        const operation = definition;
        const queryName = operation.name?.value;
        const variables = operation.variableDefinitions;

        if (queryName) {
          const queryParams = variables
            ?.map((v) => `params.${v.variable.name.value}`)
            .join(', ') || '';

            const variableTypeName = `types.${queryName}QueryVariables`

          // Generating the function for each query document
          generatedCode += `
export const ${lowercaseFirstLetter(queryName)} = (${variables ? `params: ${variableTypeName}` : ''}, f = fetch): ${returnTypeName}<types.${queryName}Query> => ({
  queryKey: ["${queryName}", ${queryParams}],
  queryFn: async () => executeQuery(f, {
     query: \`
          ${doc.rawSDL}
        \`,
        variables: ${variables ? 'params' : '{}'}
      })
});
`;
        }
      }
    });
  });

  return {
    content: generatedCode,
  };
};

function lowercaseFirstLetter(str) {
  if (!str) return str;  // Handle empty or null strings
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function unwrapType(type) {
  if (type.kind === 'NonNullType') {
    return type.type
  } else {
    return type
  }
}

module.exports = {
    plugin
}
