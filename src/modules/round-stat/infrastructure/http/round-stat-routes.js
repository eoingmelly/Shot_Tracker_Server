const express = require("express");

function createRoundStatRoutes({
  expressAuthMiddleware,
  getRoundStatHandler,
  getCreateRoundStatHandler,
}) {
  if (!expressAuthMiddleware)
    throw new Error("createRoundStatRoutes requires { expressAuthMiddleware }");

  if (!getRoundStatHandler)
    throw new Error("createRoundStatRoutes requires { getRoundStatHandler }");

  if (!getCreateRoundStatHandler) {
    throw new Error(
      "createRoundStatRoutes requires { getCreateRoundStatHandler }",
    );
  }

  const router = express.Router();

  router.get("/round-stats/:id", expressAuthMiddleware, getRoundStatHandler);
  router.post("/round-stats", expressAuthMiddleware, getCreateRoundStatHandler);

  return { roundStatRoutes: router };
}

module.exports = { createRoundStatRoutes };
