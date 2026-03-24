// src/server.js

require("dotenv").config();
const { createApp } = require("./app/createApp");
const {
  createDatabaseClient,
} = require("./infrastructure/persistence/create-database-client");
const {
  handleShutdownGracefully,
} = require("./infrastructure/runtime/handle-shutdown-gracefully");

const PORT = process.env.PORT || 3000;

async function startServer() {
  const database = await createDatabaseClient();
  const { app } = await createApp({ database });

  const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });

  handleShutdownGracefully({
    server,
    database,
  });

  return { app, server, database };
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
