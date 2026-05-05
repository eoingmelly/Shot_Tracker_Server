function createCreateCourseHandler({ courseService }) {
  if (!courseService)
    throw new Error("createCreateCourseHandler requires { courseService }");

  return async function createCourseHandler(req, res, next) {
    try {
      if (!req.userData)
        throw new Error("createCourseHandler requires req.userData");

      const { golferId } = req.userData;

      const { course } = req.body;

      const createdCourse = await courseService.createCourse({ course });

      return res.status(201).json({
        createdCourse,
      });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = { createCreateCourseHandler };
