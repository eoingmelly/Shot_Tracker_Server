function createGetMeHandler({ golferService }) {
  if (!golferService)
    throw new Error("createGetMeHandler requires { golferService }");

  return async function getMeHandler(req, res, next) {
    try {
      if (!req.userData) throw new Error("getMeHandler requires req.userData");

      const { sub, email, preferred_username = null } = req.userData;

      const golfer = await golferService.getOrCreateGolferFromIdentity({
        sub,
        email,
        preferredUsername: preferred_username,
      });

      return res.status(200).json({
        golfer,
      });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = { createGetMeHandler };
