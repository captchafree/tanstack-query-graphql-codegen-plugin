const { PluginFunction } = require('@graphql-codegen/plugin-helpers');

const typeMap = {
  'ID': 'string',
  'String': 'string',
}
/**
 * GraphQL Codegen Plugin to generate TanStack Query functions
 * @type {PluginFunction}
 */
const plugin = (schema, documents, config) => {
  let generatedCode = `import * as types from './graphql';\n\n`;

  generatedCode += `export type QueryResult<T> = {
  queryKey: unknown[],
  queryFn: () => Promise<T>
};\n\n`

  documents.forEach((doc) => {
    doc.document.definitions.forEach((definition) => {
      if (definition.kind === 'OperationDefinition' && definition.operation === 'query') {
        const operation = definition;
        const queryName = operation.name?.value;
        const variables = operation.variableDefinitions;

        if (queryName) {
          const variableTypes = variables
            ?.map((v) => {
              const name = v.variable.name.value;
              const unwrappedType = unwrapType(v.type)
              const type = unwrappedType.kind === 'NamedType' ? unwrappedType.name.value : 'any';
              return `${name}: ${typeMap[type] ?? type}`;
            })
            .join(', ') || '';

          const queryParams = variables
            ?.map((v) => `params.${v.variable.name.value}`)
            .join(', ') || '';

            const variableTypeName = `types.${queryName}QueryVariables`

          // Generating the function for each query document
          generatedCode += `
export const ${lowercaseFirstLetter(queryName)} = (${variables ? `params: ${variableTypeName}` : ''}, f = fetch): QueryResult<types.${queryName}Query> => ({
  queryKey: ["${queryName}", ${queryParams}],
  queryFn: async () => {
    const res = await f('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: \`
          ${doc.rawSDL}
        \`,
        variables: ${variableTypes ? 'params' : '{}'}
      }),
    });

    if (!res.ok) {
      throw new Error('There was an error');
    }

    const data = await res.json();
    return data;
  },
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
