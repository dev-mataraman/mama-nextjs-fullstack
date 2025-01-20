import HealthController from "@/server/controllers/health.controller";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import ex from "@/utils/ex";

const main = new Hono().get("/health", HealthController);

const app = new Hono().basePath("/api")
    .route("", ex)
    .route("/main", main);
export const GET = handle(app);
export const POST = handle(app);
export type AppType = typeof app;
