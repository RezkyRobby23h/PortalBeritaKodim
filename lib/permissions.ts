/**
 * Better Auth Access Control (AC) configuration.
 *
 * Defines the permission model for the portal:
 *   - USER   : authenticated visitor, no content-management rights
 *   - EDITOR : can create/manage content (posts, categories, breaking-news, messages)
 *   - ADMIN  : full access including user management
 *
 * Must be imported on both server (auth.ts) and client (auth-client.ts).
 */
import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

// ── Resource / permission map ─────────────────────────────────────────────────
export const statement = {
  /** Inherit default user & session resources from the admin plugin */
  ...defaultStatements,
  post: ["create", "update", "delete"] as const,
  category: ["create", "update", "delete"] as const,
  breakingNews: ["create", "update", "delete"] as const,
  message: ["read", "delete"] as const,
} as const;

export const ac = createAccessControl(statement);

// ── Role definitions ──────────────────────────────────────────────────────────

/** Regular authenticated user — no CMS access */
export const userRole = ac.newRole({
  user: [],
  session: [],
  post: [],
  category: [],
  breakingNews: [],
  message: [],
});

/** Editor — full content management, no user management */
export const editorRole = ac.newRole({
  user: [],
  session: [],
  post: ["create", "update", "delete"],
  category: ["create", "update", "delete"],
  breakingNews: ["create", "update", "delete"],
  message: ["read", "delete"],
});

/**
 * Admin — everything the editor can do, plus user management.
 * `adminAc.statements` adds the built-in user/session permissions
 * from the admin plugin (set-role, ban, impersonate, etc.).
 */
export const adminRole = ac.newRole({
  ...adminAc.statements,
  post: ["create", "update", "delete"],
  category: ["create", "update", "delete"],
  breakingNews: ["create", "update", "delete"],
  message: ["read", "delete"],
});
