export const env = {
  JWT_SECRET: process.env['JWT_SECRET'] as string,
  JWT_EXPIRATION: Number(process.env['JWT_EXPIRATION']),
  API_GQL_URL: process.env['API_GQL_URL'] as string,
};
