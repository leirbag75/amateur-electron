const sqlite3 = require('sqlite3');

function defaultCallback(resolve, reject) {
  return (error, data) => {
    if(error)
      reject(error);
    else
      resolve(data);
  }
}

class Database {

  constructor(path) {
    this.db = new sqlite3.Database(path);
  }

  get(sql, ...args) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, ...args, defaultCallback(resolve, reject));
    });
  }

  all(sql, ...args) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, ...args, defaultCallback(resolve, reject));
    });
  }

  prepare(sql, ...args) {
    return new Statement(this.db.prepare(sql, ...args));
  }

  close() {
    this.db.close();
  }

}

class Statement {

  constructor(statement) {
    this.statement = statement;
  }

  get(...args) {
    return new Promise((resolve, reject) => {
      this.statement.get(...args, defaultCallback(resolve, reject));
    });
  }

  all(...args) {
    return new Promise((resolve, reject) => {
      this.statement.all(...args, defaultCallback(resolve, reject));
    });
  }

  finalize() {
    this.statement.finalize();
  }

}

module.exports = {
  Database
};
