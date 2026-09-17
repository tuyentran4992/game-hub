/**
 * API routes for Juicy Merge
 * - Save/load scores via Redis
 * - Leaderboard using Redis Sorted Set
 */
import { Hono } from "hono";
declare const api: Hono<import("hono/types").BlankEnv, import("hono/types").BlankSchema, "/">;
export { api };
