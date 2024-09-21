import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'codegen/schema.graphql',
  overwrite: true,
  documents: ['app/**/*.tsx', 'app/**/*.ts'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    './app/lib/gql/@generated/': {
      preset: 'client',
      plugins: [],
      config: {
        scalars: { DateTime: 'string' },
      },
    },
  },
};

export default config;
