function createGetRoundStatsHandler({ roundStatService }) {
  if (!roundStatService)
    throw new Error("createGetRoundStatsHandler requires { roundStatService }");

  return async function getRoundStatHandler(req, res, next) {
    try {
      if (!req.userData)
        throw new Error("getRoundStatHandler requires req.userData");

      const { golferId } = req.userData;

      const roundStats = await roundStatService.getRoundStats({ golferId });

      return res.status(200).json({
        roundStats,
      });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = { createGetRoundStatsHandler };
