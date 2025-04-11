import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["error"],
  // log: ['info', 'warn', 'error']
});

export { prisma };
