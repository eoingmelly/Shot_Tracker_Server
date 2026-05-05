function createDeleteCourseHandler({ courseService }) {
  if (!courseService)
    throw new Error("createDeleteCourseHandler requires { courseService }");

  return async function deleteCourseHandler(req, res, next) {
    try {
      if (!req.userData)
        throw new Error("deleteCourseHandler requires req.userData");

      const { golferId } = req.userData;

      const { id } = req.params;

      const course = await courseService.deleteCourse({ id });

      return res.status(204).json({
        course,
      });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = { createDeleteCourseHandler };
