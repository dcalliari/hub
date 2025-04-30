import { envSchema } from "./env.schema";

const environment = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL,
  SERVER_ENVIRONMENT: process.env.SERVER_ENVIRONMENT || process.env.ENVIRONMENT,
  STAGE: process.env.STAGE,
  PORT: process.env.PORT,
  BILLING_URL: process.env.BILLING_URL,
  BILLING_USER: process.env.BILLING_USER,
  BILLING_PASSWORD: process.env.BILLING_PASSWORD,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  QUEUE_ORDER: process.env.QUEUE_ORDER,
  QUEUE_STATUS: process.env.QUEUE_STATUS,
  CRONJOB_INTERVAL: process.env.CRONJOB_INTERVAL,
  DISABLE_CRONJOB: process.env.DISABLE_CRONJOB,
};

// Validate environment variables against schema
const env = envSchema.parse(environment);
console.log("Environment variables are valid!");

export default env;
