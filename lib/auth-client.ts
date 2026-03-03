import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins";
import { ac, adminRole, editorRole, userRole } from "@/lib/permissions";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  plugins: [
    adminClient({
      ac,
      roles: {
        USER: userRole,
        EDITOR: editorRole,
        ADMIN: adminRole,
      },
    }),
  ],
});
