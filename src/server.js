// src/server.js
require("dotenv").config();

const { buildServiceContainer } = require("./modules/build-service-container");
const { createApp } = require("./app/createApp");

async function startServer() {
  const { app } = await createApp({ buildServiceContainer });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
}

startServer();
