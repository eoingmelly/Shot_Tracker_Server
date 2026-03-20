function handleShutdownGracefully({ server, database, logger = console }) {
  let isShuttingDown = false;

  async function shutdown(signal) {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;
    logger.log(`${signal} received. Shutting down gracefully...`);

    try {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            return reject(error);
          }

          resolve();
        });
      });

      if (database && typeof database.disconnect === "function") {
        await database.disconnect();
      }

      logger.log("Shutdown complete.");
      process.exit(0);
    } catch (error) {
      logger.error("Error during graceful shutdown:", error);
      process.exit(1);
    }
  }

  process.on("SIGINT", () => {
    shutdown("SIGINT");
  });

  process.on("SIGTERM", () => {
    shutdown("SIGTERM");
  });
}

module.exports = { handleShutdownGracefully };
