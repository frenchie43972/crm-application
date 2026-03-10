import app from "./app.js";
import { runMigrations } from "./db/migrate.js";

const PORT = process.env.PORT || 3000;

/**
 * Run database migrations before starting the server.
 *
 * This guarantees the database schema exists before the API
 * begins accepting requests.
 */

await runMigrations();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
