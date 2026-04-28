function createCreateRoundStatHandler({ roundStatService }) {
  if (!roundStatService)
    throw new Error(
      "createCreateRoundStatHandler requires { roundStatService }",
    );

  return async function createRoundStatHandler(req, res, next) {
    try {
      if (!req.userData)
        throw new Error("createRoundStatHandler requires req.userData");

      const { golferId } = req.userData;
      const { courseId, datePlayed } = req.body;

      const roundStat = await roundStatService.createRoundStat({
        datePlayed,
        courseId,
        golferId,
      });

      return res.status(201).json({
        roundStat,
      });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = { createCreateRoundStatHandler };
