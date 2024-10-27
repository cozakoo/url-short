// lib/db/prisma.js
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = globalForPrisma;
}

export const prisma = globalForPrisma;
