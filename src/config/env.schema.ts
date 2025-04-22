import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().url().min(1),
  SERVER_ENVIRONMENT: z.preprocess((value) => {
    if (value === "Desenvolvimento") return "LocalMachine";
    if (value === "Produção") return "DeployedServer";

    return value;
  }, z.enum(["LocalMachine", "DeployedServer"])),
  STAGE: z.string().min(1),
  PORT: z.string().regex(/^\d+$/).min(1),
  BILLING_URL: z.string().url().min(1),
  BILLING_USER: z.string().min(1),
  BILLING_PASSWORD: z.string().min(1),
  REDIS_HOST: z.string().min(1),
  REDIS_PORT: z.string().regex(/^\d+$/).min(1),
  REDIS_PASSWORD: z.string().min(1),
  QUEUE_ORDER: z.string().min(1),
  QUEUE_STATUS: z.string().min(1),
  CRONJOB_INTERVAL: z.string().default('* * * * *'),
  DISABLE_CRONJOB: z.coerce
  .number()
  .optional()
  .default(0)
  .transform(Boolean),
});
