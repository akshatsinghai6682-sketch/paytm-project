import { PrismaClient } from '@prisma/client';

const NEON_DB_URL = "postgresql://neondb_owner:npg_Iiykm2zxs9aG@ep-gentle-haze-be4avg5w-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require";

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL || NEON_DB_URL,
      },
    },
  });
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma: ReturnType<typeof prismaClientSingleton> = globalThis.prismaGlobal ?? prismaClientSingleton()

export { PrismaClient }
export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma