export const env = {
  JWT_SECRET: process.env['JWT_SECRET'] as string,
  JWT_EXPIRATION: process.env['JWT_EXPIRATION'] as string,
  API_GQL_URL: process.env['API_GQL_URL'] as string,
};
