const { connectMongo } = require("./mongo/connect-mongo");

async function createDatabaseClient({
  dbType = process.env.DB_TYPE || "mongo",
  mongoUri = process.env.MONGO_URI,
  mongoOptions = {},
  connectMongoFn = connectMongo,
} = {}) {
  if (!dbType) {
    throw new Error("createDatabaseClient requires a dbType");
  }

  switch (dbType) {
    case "mongo": {
      const mongoConnection = await connectMongoFn({
        mongoUri,
        mongoOptions,
      });

      return {
        type: "mongo",
        client: mongoConnection,
        async disconnect() {
          if (
            mongoConnection &&
            typeof mongoConnection.disconnect === "function"
          ) {
            await mongoConnection.disconnect();
          }
        },
      };
    }

    case "in-memory": {
      return {
        type: "in-memory",
        client: null,
        async disconnect() {},
      };
    }

    case "sql": {
      throw new Error(
        'SQL database support is not implemented yet. Set DB_TYPE="mongo" or "in-memory".',
      );
    }

    default: {
      throw new Error(
        `Unsupported DB_TYPE "${dbType}". Supported values: "mongo", "in-memory", "sql".`,
      );
    }
  }
}

module.exports = { createDatabaseClient };
