import { EnvSchema } from "./env-schema";

const env = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL,
  SERVER_ENVIRONMENT: process.env.SERVER_ENVIRONMENT || process.env.ENVIRONMENT,
  STAGE: process.env.STAGE,
  PORT: process.env.PORT,
  BASE_URL: process.env.BASE_URL,
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
};

// Validate environment variables against schema
const Env = EnvSchema.parse(env);
console.log('Environment variables are valid!');

export default Env;
