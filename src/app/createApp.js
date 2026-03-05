// src/app/createApp.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

async function createApp({ buildServiceContainer }) {
  try {
    const app = express();

    let servicesContainer = await buildServiceContainer();

    app.use(helmet());
    app.use(cors());
    app.use(express.json());

    // Example protected route
    app.get("/health", (req, res) => res.json({ ok: true }));

    app.get(
      "/me",
      servicesContainer.middleware.createAuthHttpMiddleware,
      (req, res) => {
        res.json({ userData: req.userData || null });
      },
    );

    return { app };
  } catch (e) {
    console.log("e? ", e);
    return null;
  }
}

module.exports = { createApp };
