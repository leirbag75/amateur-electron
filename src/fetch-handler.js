
class FetchHandler {

  constructor(url, db) {
    this.url = url;
    this.db = db;
  }

  static forUrl(url, db) {
    if(url === 'entry')
      return new EntryHandler(url, db);
    if(url.slice(0, 7) === 'images/')
      return new ImageHandler(url, db);
    if(url.slice(0, 5) === 'tags/')
      return new TagHandler(url, db);
  }

};

class EntryHandler extends FetchHandler {

  async handle() {
    return this.db.all("SELECT id FROM library_entry")
      .then(rows => ({
        links: rows.map(row => ({
          rel: 'collection-image',
          href:`images/${row.id}`
        }))
      }));
  }

}

class ImageHandler extends FetchHandler {

  async handle() {
    let match = this.url.match(/images\/([0-9]+)/);
    if(match) {
      let index = parseInt(match[1]);
      let libraryStatement = this.db.prepare("SELECT src, likes FROM library_entry WHERE id = ?");
      let row = await libraryStatement.get(index);
      libraryStatement.finalize();
      let tagStatement = this.db.prepare("SELECT id, name FROM tag JOIN tag_entry ON tag.id = tag_entry.tag_id WHERE tag_entry.library_entry_id = ?");
      let tags = await tagStatement.all(index);
      tagStatement.finalize();
      return {
        ...row,
        links: tags.map(tag => ({
          rel: 'tag',
          href: `tags/${tag.id}`,
          embed: {
            name: tag.name
          }
        }))
      };
    }
  }

}

class TagHandler extends FetchHandler {

  async handle() {
    let match = this.url.match(/tags\/([0-9]+)/);
    let index = parseInt(match[1]);
    let statement = this.db.prepare("SELECT name FROM tag WHERE id = ?");
    return statement.get(index)
      .then(data => {
        statement.finalize();
        return data;
      });
  }

}

module.exports = FetchHandler;
