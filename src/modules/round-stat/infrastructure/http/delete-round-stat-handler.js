function createDeleteRoundStatHandler({ roundStatService }) {
  if (!roundStatService)
    throw new Error(
      "createDeleteRoundStatHandler requires { roundStatService }",
    );

  return async function deleteRoundStatHandler(req, res, next) {
    try {
      if (!req.userData)
        throw new Error("deleteRoundStatHandler requires req.userData");

      const { golferId } = req.userData;
      const { id: roundId } = req.params;

      const roundStat = await roundStatService.deleteRoundStat({
        id,
      });

      return res.status(204).json({
        roundStat,
      });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = { createGetRoundStatHandler };
