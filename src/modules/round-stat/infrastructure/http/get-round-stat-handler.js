function createGetRoundStatHandler({ roundStatService }) {
  if (!roundStatService)
    throw new Error("createGetRoundStatHandler requires { roundStatService }");

  return async function getRoundStatHandler(req, res, next) {
    try {
      if (!req.userData)
        throw new Error("getRoundStatHandler requires req.userData");

      const { golferId } = req.userData;
      const { id: roundId } = req.params;

      const roundStat = await roundStatService.getRoundStat({
        roundId,
        golferId,
      });

      return res.status(200).json({
        roundStat,
      });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = { createGetRoundStatHandler };
