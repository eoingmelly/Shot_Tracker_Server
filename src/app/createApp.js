// src/app/createApp.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

async function createApp({ buildServiceContainer }) {
  try {
    const app = express();

    let servicesContainer = await buildServiceContainer();

    const corsOptions = {
      origin: [
        "http://localhost:5173",
        //, 'https://my-app.com'
      ],
    };
    app.use(helmet());
    app.use(cors(corsOptions));
    app.use(express.json());

    // Example unprotected route
    app.get("/health", (req, res) => res.json({ ok: true }));

    const { expressAuthMiddleware } = servicesContainer.middleware;

    app.get(
      "/me",
      (req, res, next) => {
        console.log("hit /me route");
        next();
      },
      expressAuthMiddleware,
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
