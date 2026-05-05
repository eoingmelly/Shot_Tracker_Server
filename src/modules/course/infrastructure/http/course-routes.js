const express = require("express");

function createCourseRoutes({
  expressAuthMiddleware,
  getCourseHandler,
  getCoursesHandler,
  createCourseHandler,
}) {
  if (!expressAuthMiddleware)
    throw new Error("createCoursesRoutes requires { expressAuthMiddleware }");

  if (!getCourseHandler)
    throw new Error("createCoursesRoutes requires { getCourseHandler }");

  if (!getCoursesHandler)
    throw new Error("createCoursesRoutes requires { getCoursesHandler }");

  if (!createCourseHandler) {
    throw new Error("createCoursesRoutes requires { createCourseHandler }");
  }

  const router = express.Router();

  router.get("/courses/:id", expressAuthMiddleware, getCourseHandler);
  router.get("/courses", expressAuthMiddleware, getCoursesHandler);
  router.post("/courses", expressAuthMiddleware, createCourseHandler);

  return { courseRoutes: router };
}

module.exports = { createCourseRoutes };
