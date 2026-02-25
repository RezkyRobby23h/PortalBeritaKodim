import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ac, adminRole, editorRole, userRole } from "@/lib/permissions";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {},
  plugins: [
    admin({
      /**
       * Map to the uppercase role values used in the existing database enum
       * (USER | ADMIN | EDITOR).
       */
      defaultRole: "USER",
      adminRoles: ["ADMIN"],
      /** Custom access-control that adds the EDITOR role + content resources */
      ac,
      roles: {
        USER: userRole,
        EDITOR: editorRole,
        ADMIN: adminRole,
      },
    }),
  ],
});
