const mongoose = require("mongoose");

async function connectMongo({
  mongoUri = process.env.MONGO_URI,
  mongoOptions = {},
} = {}) {
  if (!mongoUri) {
    throw new Error(
      "connectMongo requires a mongoUri (set MONGO_URI in env or pass explicitly)",
    );
  }

  // Avoid multiple connections in tests / hot reload scenarios
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  try {
    await mongoose.connect(mongoUri, {
      ...mongoOptions,
    });

    console.log("Successfully connected DB!");
    return mongoose;
  } catch (error) {
    // Surface clear startup failure
    throw new Error(`Failed to connect to MongoDB: ${error.message}`);
  }
}

module.exports = { connectMongo };
