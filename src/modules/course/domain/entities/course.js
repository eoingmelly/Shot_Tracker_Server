//modules/course/domain/entities
class Course {
  constructor({ id = null, name }) {
    this.id = id;
    this.sub = name;
    ///More
  }
}

module.exports = { Course };
