import Fastify from "fastify";
import { entryRoutes } from "./routes/entries.js";
import { themeRoutes } from "./routes/themes.js";

const app = Fastify({
  logger: true,
});

await app.register(entryRoutes);
await app.register(themeRoutes);

const port = 3001;
const host = "127.0.0.1";

try {
  await app.listen({ port, host });
  console.log(`Server running at http://${host}:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
