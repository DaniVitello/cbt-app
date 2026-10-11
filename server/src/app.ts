import Fastify, { type FastifyInstance } from "fastify";
import { entryRoutes } from "./routes/entries.js";
import { themeRoutes } from "./routes/themes.js";

/** Construye la app sin levantarla: los tests la usan en proceso vía app.inject(). */
export async function buildApp(opts?: { logger?: boolean }): Promise<FastifyInstance> {
  const app = Fastify({
    logger: opts?.logger ?? false,
  });

  await app.register(entryRoutes);
  await app.register(themeRoutes);

  return app;
}
