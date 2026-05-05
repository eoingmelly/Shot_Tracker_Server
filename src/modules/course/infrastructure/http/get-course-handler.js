function createGetCourseHandler({ courseService }) {
  if (!courseService)
    throw new Error("createGetCourseHandler requires { courseService }");

  return async function getCourseHandler(req, res, next) {
    try {
      if (!req.userData)
        throw new Error("getCourseHandler requires req.userData");

      const { id } = req.params;
      const { golferId } = req.userData;

      const course = await courseService.getCourseById({ id });

      return res.status(200).json({
        course,
      });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = { createGetCourseHandler };
