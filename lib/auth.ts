// src/lib/auth.ts
import { PrismaClient } from '@prisma/client';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.BETTER_AUTH_URL!],
  cookies: { secure: false, sameSite: 'lax' },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  // 👇 Esto hace que el campo role exista en DB (ya lo tenemos)
  // y que además se incluya en session.user
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: 'ADMIN',
        input: false, // el cliente no puede enviar este campo
      },
    },
  },

  telemetry: { enabled: false },
  logger: { level: 'debug' },
});
