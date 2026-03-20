//modules/golfer/domain/entities
class Golfer {
  constructor({ id = null, sub, email, preferredUsername = null }) {
    this.id = id;
    this.sub = sub;
    this.email = email;
    this.preferredUsername = preferredUsername;
  }
}

module.exports = { Golfer };
