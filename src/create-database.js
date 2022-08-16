const sqlite3 = require('sqlite3');
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, '../amateur.db'));

db.serialize(() => {

  db.run(`CREATE TABLE library_entry(
    id INTEGER PRIMARY KEY,
    src VARCHAR(256) NOT NULL,
    likes USIGNED INT NOT NULL DEFAULT 0
  )`);

  db.run(`CREATE TABLE tag(
    id INTEGER PRIMARY KEY,
    name VARCHAR(32) NOT NULL
  )`);

  db.run(`CREATE TABLE tag_entry(
    library_entry_id UNSIGNED INT NOT NULL REFERENCES library_entry(id),
    tag_id UNSIGNED INT NOT NULL REFERENCES tag(id)
  )`);

});

db.close();
