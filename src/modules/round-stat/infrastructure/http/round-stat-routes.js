const express = require("express");

function createRoundStatRoutes({
  expressAuthMiddleware,
  getRoundStatHandler,
  createRoundStatHandler,
}) {
  if (!expressAuthMiddleware)
    throw new Error("createRoundStatRoutes requires { expressAuthMiddleware }");

  if (!getRoundStatHandler)
    throw new Error("createRoundStatRoutes requires { getRoundStatHandler }");

  if (!createRoundStatHandler) {
    throw new Error(
      "createRoundStatRoutes requires { createRoundStatHandler }",
    );
  }

  const router = express.Router();

  router.get("/round-stats/:id", expressAuthMiddleware, getRoundStatHandler);
  router.post("/round-stats", expressAuthMiddleware, createRoundStatHandler);

  return { roundStatRoutes: router };
}

module.exports = { createRoundStatRoutes };
