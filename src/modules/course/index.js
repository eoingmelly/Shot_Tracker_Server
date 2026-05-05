const { CourseService } = require("./application/course-service");
const {
  MongoCourseRepository,
} = require("./infrastructure/persistence/mongo/mongo-course-repository.js");
const {
  MongoCourseMapper,
} = require("./infrastructure/persistence/mongo/mappers/mongo-course-mapper.js");
const {
  CourseModel,
} = require("./infrastructure/persistence/mongo/course-model.js");

const {
  createGetCourseHandler,
} = require("./infrastructure/http/get-course-handler");

const {
  createGetCoursesHandler,
} = require("./infrastructure/http/get-courses-handler");

const {
  createCreateCourseHandler,
} = require("./infrastructure/http/create-course-handler.js");

const {
  createDeleteCourseHandler,
} = require("./infrastructure/http/delete-course-handler.js");

const { createCourseRoutes } = require("./infrastructure/http/course-routes");

function _createCourseRepository({ database }) {
  const databaseType = database?.type || "mongo";

  switch (databaseType) {
    case "mongo": {
      const mongoCourseMapper = new MongoCourseMapper();

      return new MongoCourseRepository({
        courseModel: CourseModel,
        mongoCourseMapper,
      });
    }

    case "in-memory":
      throw new Error(
        'createCourseRepository does not yet support database.type "in-memory"',
      );

    case "sql":
      throw new Error(
        'createCourseRepository does not yet support database.type "sql"',
      );

    default:
      throw new Error(
        `createCourseRepository received unsupported database.type "${databaseType}"`,
      );
  }
}

function createCourseModule({ expressAuthMiddleware, database } = {}) {
  if (!expressAuthMiddleware) {
    throw new Error("createCourseModule requires { expressAuthMiddleware }");
  }

  const courseRepository = _createCourseRepository({ database });

  const courseService = new CourseService({
    courseRepository,
  });

  const getCourseHandler = createGetCourseHandler({
    courseService,
  });

  const getCoursesHandler = createGetCoursesHandler({
    courseService,
  });

  const createCourseHandler = createCreateCourseHandler({
    courseService,
  });

  const deleteCourseHandler = createDeleteCourseHandler({ courseService });

  const { courseRoutes } = createCourseRoutes({
    expressAuthMiddleware,
    getCourseHandler,
    getCoursesHandler,
    createCourseHandler,
    deleteCourseHandler,
  });

  return {
    courseService,
    courseRoutes,
  };
}

module.exports = {
  createCourseModule,
};
