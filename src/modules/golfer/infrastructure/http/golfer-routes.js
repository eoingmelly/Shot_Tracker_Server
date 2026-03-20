const express = require("express");

function createGolferRoutes({ expressAuthMiddleware, getMeHandler }) {
  if (!expressAuthMiddleware)
    throw new Error("createGolferRoutes requires { expressAuthMiddleware }");

  if (!getMeHandler)
    throw new Error("createGolferRoutes requires { getMeHandler }");

  const router = express.Router();

  router.get("/me", expressAuthMiddleware, getMeHandler);

  return { golferRoutes: router };
}

module.exports = { createGolferRoutes };
