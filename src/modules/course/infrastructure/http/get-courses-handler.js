function createGetCoursesHandler({ courseService }) {
  if (!courseService)
    throw new Error("createGetCoursesHandler requires { courseService }");

  return async function getCoursesHandler(req, res, next) {
    try {
      if (!req.userData)
        throw new Error("getCoursesHandler requires req.userData");

      const { golferId } = req.userData;

      console.log("Hyurrayr");
      const courses = await courseService.getCourses();

      return res.status(200).json({
        courses,
      });
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = { createGetCoursesHandler };
