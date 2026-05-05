//modules/course/domain/entities
class Course {
  constructor({ id = null, name, createdBy, active }) {
    this.id = id;
    this.name = name;
    //This will be a name for display purposes...
    this.createdBy = createdBy;
    ///More

    this.active = active;
  }
}

module.exports = { Course };
