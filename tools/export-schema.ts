import fs from 'fs';
import { lexicographicSortSchema, printSchema } from 'graphql';
import path from 'path';
import { schema } from '~/lib/server/graphql/schema';

const main = async () => {
  const outputFile = './codegen/schema.graphql';

  const schemaAsString = printSchema(lexicographicSortSchema(schema));
  await fs.writeFileSync(outputFile, schemaAsString);
  console.log(`🌙${path.resolve(outputFile)} is created!`);
};

main();
