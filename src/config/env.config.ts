import { envSchema } from "./env.schema";

const environment = {
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
const env = envSchema.parse(environment);
console.log("Environment variables are valid!");

export default env;
