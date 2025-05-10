import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().url().min(1),
  RABBITMQ_URL: z.string().url().min(1),
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
});
