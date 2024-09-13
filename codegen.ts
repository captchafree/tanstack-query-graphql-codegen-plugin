
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "./schema.graphql",
  documents: './src/**/*.graphql',
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations"]
    },
    "src/generated/functions.ts": {
      plugins: ["./tanstack-query-adapter-plugin.cjs"],
    }
  }
};

export default config;
