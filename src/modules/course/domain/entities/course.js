//modules/course/domain/entities
class Course {
  constructor({ id = null, name, createdBy }) {
    this.id = id;
    this.name = name;
    this.createdBy = createdBy;
    ///More
  }
}

module.exports = { Course };
