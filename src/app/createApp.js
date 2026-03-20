// src/app/createApp.js

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { buildServiceContainer } = require("../modules/build-service-container");

async function createApp({ database } = {}) {
  const app = express();

  const corsOptions = {
    origin: [
      "http://localhost:5173",
      //, 'https://my-app.com'
    ],
  };
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(express.json());

  //One health check route;
  app.get("/health", (req, res) => res.json({ ok: true }));

  let servicesContainer = await buildServiceContainer({ database });

  const { golferRoutes } = servicesContainer.routes;
  app.use(golferRoutes);

  return { app };
}

module.exports = { createApp };
